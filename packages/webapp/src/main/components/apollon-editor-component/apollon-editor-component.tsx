import { ApollonEditor, ApollonMode, ApollonOptions, Patch, Selection, UMLModel } from '@ls1intum/apollon';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { DiagramView } from 'shared/src/main/diagram-view';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { APPLICATION_SERVER_VERSION, DEPLOYMENT_URL, NO_HTTP_URL, WS_PROTOCOL } from '../../constant';
import { DiagramRepository } from '../../services/diagram/diagram-repository';

import { EditorOptionsRepository } from '../../services/editor-options/editor-options-repository';
import { ImportRepository } from '../../services/import/import-repository';
import { ModalRepository } from '../../services/modal/modal-repository';
import { ShareRepository } from '../../services/share/share-repository';
import { uuid } from '../../utils/uuid';
import { ModalContentType } from '../modals/application-modal-types';
import { ApplicationState } from '../store/application-state';
import { toast } from 'react-toastify';
import { selectionDiff } from '../../utils/selection-diff';
import { CollaborationMessage } from '../../utils/collaboration-message-type';
import { withRouter } from '../../hocs/withRouter';
import { withApollonEditor } from './with-apollon-editor';
import { Diagram, DiagramState } from '../../services/diagram/diagramSlice';

const ApollonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  overflow: hidden;
`;

type OwnProps = {};

type StateProps = {
  diagram: DiagramState;
  options: ApollonOptions;
  fromServer: boolean;
  collaborationName: string;
  collaborationColor: string;
};

type DispatchProps = {
  updateDiagram: typeof DiagramRepository.updateDiagram;
  importDiagram: typeof ImportRepository.importJSON;
  changeEditorMode: typeof EditorOptionsRepository.changeEditorMode;
  changeReadonlyMode: typeof EditorOptionsRepository.changeReadonlyMode;
  updateCollaborators: typeof ShareRepository.updateCollaborators;
  openModal: typeof ModalRepository.showModal;
};

type Props = OwnProps & StateProps & DispatchProps & { params: any; location: any; setEditor: any; editor: any };

const ApollonEditorComponent: React.FC<Props> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ApollonEditor | null>(null);
  const clientRef = useRef<W3CWebSocket | null>(null); // Ref to keep client stable
  const [selection, setSelection] = useState<Selection>({ elements: {}, relationships: {} });

  // Memoize props.options to avoid unnecessary re-renders
  const memoizedOptions = useMemo(
    () => props.options,
    [props.options.type, props.options.mode, props.options.readonly],
  );

  // Establish collaboration connection
  const establishCollaborationConnection = (token: string, name: string, color: string) => {
    if (!clientRef.current) {
      const newClient = new W3CWebSocket(`${WS_PROTOCOL}://${NO_HTTP_URL}`);
      clientRef.current = newClient;

      newClient.onopen = () => {
        const collaborators = { name, color };
        newClient.send(JSON.stringify({ token, collaborators }));
      };

      newClient.onmessage = (message: any) => {
        const { originator, collaborators, diagram, patch, selection } = JSON.parse(
          message.data,
        ) as CollaborationMessage;
        if (collaborators) {
          props.updateCollaborators(collaborators);
          props.editor?.pruneRemoteSelectors(collaborators);
        }
        if (diagram) {
          props.importDiagram(JSON.stringify(diagram));
        }
        if (patch) {
          props.editor?.importPatch(patch);
        }
        if (selection && originator) {
          props.editor?.remoteSelect(originator.name, originator.color, selection.selected, selection.deselected);
        }
      };
    }
  };

  // Initialize the editor once, when the container is available
  useEffect(() => {
    console.log('DEBUGF wwowoow');
    if (containerRef.current && !editorRef.current) {
      editorRef.current  = new ApollonEditor(containerRef.current, memoizedOptions);

      editorRef.current.subscribeToAllModelChangePatches((patch: Patch) => {
        if (clientRef.current) {
          const { token } = props.params;
          const { collaborationName, collaborationColor } = props;
          clientRef.current.send(
            JSON.stringify({
              token,
              collaborator: { name: collaborationName, color: collaborationColor },
              patch,
            }),
          );
        }
      });

      editorRef.current.subscribeToModelChange((model: UMLModel) => {
        const diagram: Diagram = { ...props.diagram.diagram, model } as Diagram;
        props.updateDiagram(diagram);
      });

      editorRef.current.subscribeToSelectionChange((newSelection: Selection) => {
        const diff = selectionDiff(selection, newSelection);
        setSelection(newSelection);

        if (clientRef.current && (diff.selected.length > 0 || diff.deselected.length > 0)) {
          const { collaborationName, collaborationColor } = props;
          const { token } = props.params;

          clientRef.current.send(
            JSON.stringify({
              token,
              collaborator: { name: collaborationName, color: collaborationColor },
              selection: diff,
            }),
          );
        }
      });

      props.setEditor(editorRef.current);
    }
  }, [containerRef, memoizedOptions, props]);

  useEffect(() => {
    console.log('DEBUGF wwowoow');

    if (APPLICATION_SERVER_VERSION && DEPLOYMENT_URL) {
      const { token } = props.params;
      if (token) {
        const query = new URLSearchParams(props.location.search);
        const view: DiagramView | null = query.get('view') as DiagramView;
        const notifyUser: string | null = query.get('notifyUser');
        if (view) {
          switch (view) {
            case DiagramView.SEE_FEEDBACK:
              props.changeEditorMode(ApollonMode.Assessment);
              props.changeReadonlyMode(true);
              break;
            case DiagramView.GIVE_FEEDBACK:
              props.changeEditorMode(ApollonMode.Assessment);
              props.changeReadonlyMode(false);
              break;
            case DiagramView.EDIT:
              props.changeEditorMode(ApollonMode.Modelling);
              props.changeReadonlyMode(false);
              break;
            case DiagramView.COLLABORATE:
              props.changeEditorMode(ApollonMode.Modelling);
              props.changeReadonlyMode(false);
              if (!props.collaborationName || !props.collaborationColor) {
                props.openModal(ModalContentType.CollaborationModal, 'lg');
              }
              establishCollaborationConnection(token, props.collaborationName, props.collaborationColor);
              if (notifyUser === 'true') {
                displayToast();
                window.history.replaceState({}, document.title, window.location.pathname + '?view=' + view);
              }
              break;
          }
        }

        if (view !== DiagramView.COLLABORATE) {
          DiagramRepository.getDiagramFromServerByToken(token).then((diagram) => {
            if (diagram) {
              props.importDiagram(JSON.stringify(diagram));

              const queryParam = new URLSearchParams(props.location.search);
              const diagramView: DiagramView | null = queryParam.get('view') as DiagramView;
              if (diagramView) {
                switch (diagramView) {
                  case DiagramView.SEE_FEEDBACK:
                    props.changeEditorMode(ApollonMode.Assessment);
                    props.changeReadonlyMode(true);
                    break;
                  case DiagramView.GIVE_FEEDBACK:
                    props.changeEditorMode(ApollonMode.Assessment);
                    props.changeReadonlyMode(false);
                    break;
                  case DiagramView.EDIT:
                    props.changeEditorMode(ApollonMode.Modelling);
                    props.changeReadonlyMode(false);
                    break;
                }
              }
            }
          });
        }
      }
    }
  }, [props.collaborationName, props.collaborationColor]);

  const displayToast = () => {
    toast.success(
      'The link has been copied to your clipboard and can be shared to Collaborate, simply by pasting the link. You can re-access the link by going to share menu.',
      {
        autoClose: 10000,
      },
    );
  };

  const key = useMemo(() => {
    return (props.diagram?.diagram?.id || uuid()) + props.options.mode + props.options.type + props.options.readonly;
  }, [props.diagram?.diagram?.id, props.options.mode, props.options.type, props.options.readonly]);

  return <ApollonContainer key={key} ref={containerRef} />;
};

const enhance = compose<React.FC<OwnProps>>(
  withRouter,
  withApollonEditor,
  connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
    (state) => ({
      diagram: state.diagram,
      options: {
        type: state.editorOptions.type,
        mode: state.editorOptions.mode,
        readonly: state.editorOptions.readonly,
        enablePopups: state.editorOptions.enablePopups,
        copyPasteToClipboard: state.editorOptions.enableCopyPaste,
        model: state.diagram?.diagram?.model,
        theme: state.editorOptions.theme,
        locale: state.editorOptions.locale,
        colorEnabled: state.editorOptions.colorEnabled,
      },
      fromServer: state.share.fromServer,
      collaborationName: state.share.collaborationName,
      collaborationColor: state.share.collaborationColor,
    }),
    {
      updateDiagram: DiagramRepository.updateDiagram,
      importDiagram: ImportRepository.importJSON,
      changeEditorMode: EditorOptionsRepository.changeEditorMode,
      changeReadonlyMode: EditorOptionsRepository.changeReadonlyMode,
      updateCollaborators: ShareRepository.updateCollaborators,
      openModal: ModalRepository.showModal,
    },
  ),
);

export const ApollonEditorWrapper = enhance(ApollonEditorComponent);

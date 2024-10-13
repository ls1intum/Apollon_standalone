import { ApollonEditor, ApollonMode, Patch, Selection, UMLModel } from '@ls1intum/apollon';
import React, { useEffect, useRef, useState, useMemo, useContext } from 'react';
import styled from 'styled-components';
import { DiagramView } from 'shared/src/main/diagram-view';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { APPLICATION_SERVER_VERSION, DEPLOYMENT_URL, NO_HTTP_URL, WS_PROTOCOL } from '../../constant';
import { DiagramRepository } from '../../services/diagram/diagram-repository';

import { uuid } from '../../utils/uuid';
import { ModalContentType } from '../modals/application-modal-types';
import { toast } from 'react-toastify';
import { selectionDiff } from '../../utils/selection-diff';
import { CollaborationMessage } from '../../utils/collaboration-message-type';

import { changeEditorMode, changeReadonlyMode, updateDiagramThunk } from '../../services/diagram/diagramSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApollonEditorContext } from './apollon-editor-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateCollaborators } from '../../services/share/shareSlice';
import { useImportDiagram } from '../../services/import/useImportDiagram';
import { showModal } from '../../services/modal/modalSlice';

const ApollonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  overflow: hidden;
`;

export const ApollonEditorComponentWithConnection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ApollonEditor | null>(null);
  const clientRef = useRef<W3CWebSocket | null>(null);
  const [selection, setSelection] = useState<Selection>({ elements: {}, relationships: {} });
  const location = useLocation();
  const params = useParams();
  const editorContext = useContext(ApollonEditorContext);
  const { collaborationName, collaborationColor } = useAppSelector((state) => state.share);
  const dispatch = useAppDispatch();
  const importDiagram = useImportDiagram();
  const { diagram: reduxDiagram } = useAppSelector((state) => state.diagram);
  const options = useAppSelector((state) => state.diagram.editorOptions);
  const navigate = useNavigate();

  const editor = editorContext?.editor;
  const setEditor = editorContext?.setEditor;

  const memoizedOptions = useMemo(() => options, [options.type, options.mode, options.readonly]);

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
          dispatch(updateCollaborators(collaborators));
          editor?.pruneRemoteSelectors(collaborators);
        }
        if (diagram) {
          importDiagram(JSON.stringify(diagram));
        }
        if (patch) {
          editor?.importPatch(patch);
        }
        if (selection && originator) {
          editor?.remoteSelect(originator.name, originator.color, selection.selected, selection.deselected);
        }
      };
    }
  };
  useEffect(() => {
    const initializeEditor = async () => {
      if (containerRef.current && reduxDiagram && setEditor) {
        if (editorRef.current) {
          await editorRef.current?.nextRender;
          editorRef.current.destroy();
        }

        const editor = new ApollonEditor(containerRef.current, memoizedOptions);
        editorRef.current = editor;
        await editorRef.current?.nextRender;

        if (reduxDiagram.model) {
          editorRef.current.model = reduxDiagram.model;
        }

        editorRef.current.subscribeToAllModelChangePatches((patch: Patch) => {
          if (clientRef.current) {
            const { token } = params;
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
          const diagram = { ...reduxDiagram, model };
          dispatch(updateDiagramThunk(diagram));
        });

        editorRef.current.subscribeToSelectionChange((newSelection) => {
          const diff = selectionDiff(selection, newSelection);
          setSelection(newSelection);

          if (clientRef.current && (diff.selected.length > 0 || diff.deselected.length > 0)) {
            const { token } = params;

            clientRef.current.send(
              JSON.stringify({
                token,
                collaborator: { name: collaborationName, color: collaborationColor },
                selection: diff,
              }),
            );
          }
        });

        setEditor(editorRef.current);
      }
    };

    initializeEditor();
  }, [containerRef.current]);

  useEffect(() => {
    if (APPLICATION_SERVER_VERSION && DEPLOYMENT_URL) {
      const { token } = params;
      if (token) {
        const query = new URLSearchParams(location.search);
        const view: DiagramView | null = query.get('view') as DiagramView;
        const notifyUser: string | null = query.get('notifyUser');
        if (view) {
          switch (view) {
            case DiagramView.SEE_FEEDBACK:
              dispatch(changeEditorMode(ApollonMode.Assessment));
              dispatch(changeReadonlyMode(true));
              break;
            case DiagramView.GIVE_FEEDBACK:
              dispatch(changeEditorMode(ApollonMode.Assessment));
              dispatch(changeReadonlyMode(false));
              break;
            case DiagramView.EDIT:
              dispatch(changeEditorMode(ApollonMode.Modelling));
              dispatch(changeReadonlyMode(false));
              break;
            case DiagramView.COLLABORATE:
              dispatch(changeEditorMode(ApollonMode.Modelling));
              dispatch(changeReadonlyMode(false));
              if (!collaborationName || collaborationColor) {
                dispatch(showModal({ type: ModalContentType.CollaborationModal, size: 'lg' }));
              }
              establishCollaborationConnection(token, collaborationName, collaborationColor);
              if (notifyUser === 'true') {
                displayToast();
                navigate(`?view=${view}`, { replace: true });
                // window.history.replaceState({}, document.title, window.location.pathname + '?view=' + view);
              }
              break;
          }
        }
        if (view !== DiagramView.COLLABORATE) {
          DiagramRepository.getDiagramFromServerByToken(token).then((diagram) => {
            if (diagram) {
              importDiagram(JSON.stringify(diagram));
              const queryParam = new URLSearchParams(location.search);
              const diagramView: DiagramView | null = queryParam.get('view') as DiagramView;
              if (diagramView) {
                switch (diagramView) {
                  case DiagramView.SEE_FEEDBACK:
                    dispatch(changeEditorMode(ApollonMode.Assessment));
                    dispatch(changeReadonlyMode(true));
                    break;
                  case DiagramView.GIVE_FEEDBACK:
                    dispatch(changeEditorMode(ApollonMode.Assessment));
                    dispatch(changeReadonlyMode(false));
                    break;
                  case DiagramView.EDIT:
                    dispatch(changeEditorMode(ApollonMode.Modelling));
                    dispatch(changeReadonlyMode(false));
                    break;
                }
              }
            }
          });
        }
      }
    }
  }, [collaborationName, collaborationColor]);

  const displayToast = () => {
    toast.success(
      'The link has been copied to your clipboard and can be shared to Collaborate, simply by pasting the link. You can re-access the link by going to share menu.',
      {
        autoClose: 10000,
      },
    );
  };

  const key = reduxDiagram?.id || uuid() + options.mode + options.type + options.readonly;

  return <ApollonContainer key={key} ref={containerRef} />;
};

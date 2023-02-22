import { ApollonEditor, ApollonMode, ApollonOptions, UMLModel, Selection } from '@ls1intum/apollon';
import React, { Component, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { RouterTypes, withRouter } from '../../hocs/withRouter';
import { compose } from 'redux';
import { DiagramView } from 'shared/src/main/diagram-view';
import { updateSelectedByArray } from 'shared/src/main/services/collaborator-highlight';

import styled from 'styled-components';
// @ts-ignore
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { APPLICATION_SERVER_VERSION, DEPLOYMENT_URL, NO_HTTP_URL } from '../../constant';
import { DiagramRepository } from '../../services/diagram/diagram-repository';
import { Diagram } from '../../services/diagram/diagram-types';
import { EditorOptionsRepository } from '../../services/editor-options/editor-options-repository';
import { ImportRepository } from '../../services/import/import-repository';
import { ModalRepository } from '../../services/modal/modal-repository';
import { ShareRepository } from '../../services/share/share-repository';
import { uuid } from '../../utils/uuid';
import { ModalContentType } from '../modals/application-modal-types';
import { ApplicationState } from '../store/application-state';
import { ApollonEditorContext } from './apollon-editor-context';
import { withApollonEditor } from './with-apollon-editor';
import { toast } from 'react-toastify';

const ApollonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
`;

type OwnProps = {};

type State = {};

type StateProps = {
  diagram: Diagram | null;
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
  gotFromServer: typeof ShareRepository.gotFromServer;
  openModal: typeof ModalRepository.showModal;
};

type Props = OwnProps & StateProps & DispatchProps & ApollonEditorContext & RouterTypes;

const enhance = compose<FunctionComponent<OwnProps>>(
  withRouter,
  withApollonEditor,
  connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
    (state) => ({
      diagram: state.diagram,
      // merge application state to valid ApollonOptions
      options: {
        type: state.editorOptions.type,
        mode: state.editorOptions.mode,
        readonly: state.editorOptions.readonly,
        enablePopups: state.editorOptions.enablePopups,
        copyPasteToClipboard: state.editorOptions.enableCopyPaste,
        model: state.diagram?.model,
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
      gotFromServer: ShareRepository.gotFromServer,
      openModal: ModalRepository.showModal,
    },
  ),
);

class ApollonEditorComponent extends Component<Props, State> {
  private readonly containerRef: (element: HTMLDivElement) => void;
  private ref?: HTMLDivElement;
  private client: any;

  componentDidUpdate(prevProps: Props) {
    if (this.client) {
      if (
        this.props.collaborationName !== prevProps.collaborationName ||
        this.props.collaborationColor !== prevProps.collaborationColor
      ) {
        this.setCollaborationConnectionName();
      }
      this.hideSelfFromSelectedList();
    }
  }

  constructor(props: Props) {
    super(props);
    this.containerRef = (element: HTMLDivElement) => {
      this.ref = element;
      if (this.ref) {
        const editor = new ApollonEditor(this.ref, this.props.options);
        editor.subscribeToModelDiscreteChange((model: UMLModel) => {
          const diagram: Diagram = { ...this.props.diagram, model } as Diagram;
          if (this.client) {
            const { token } = this.props.params;
            const { collaborationName, collaborationColor } = this.props;
            this.client.send(
              JSON.stringify({
                token,
                collaborators: { name: collaborationName, color: collaborationColor },
                diagram,
                selectedElements: this.props.editor?.selection.elements,
              }),
            );
            this.hideSelfFromSelectedList();
          }
        });
        editor.subscribeToModelChange((model: UMLModel) => {
          const diagram: Diagram = { ...this.props.diagram, model } as Diagram;
          this.props.updateDiagram(diagram);
        });

        editor.subscribeToSelectionChange((selection: Selection) => {
          if (this.client) {
            const { collaborationName, collaborationColor } = this.props;
            const { token } = this.props.params;
            const selElemIds = selection.elements;
            const elements = this.props.diagram?.model?.elements;
            const updatedElement = updateSelectedByArray(selElemIds, elements!, collaborationName, collaborationColor);
            const diagram = this.props.diagram;
            if (diagram && diagram.model && diagram.model.elements) {
              diagram.model.elements = updatedElement!;
            }

            this.client.send(
              JSON.stringify({
                token,
                collaborators: { name: collaborationName, color: collaborationColor },
                diagram,
              }),
            );
            this.hideSelfFromSelectedList();
          }
        });

        this.props.setEditor(editor);
      }
    };

    if (APPLICATION_SERVER_VERSION && DEPLOYMENT_URL) {
      // hosted with backend
      const { token } = this.props.params;
      if (token) {
        // get query param
        const query = new URLSearchParams(this.props.location.search);
        const view: DiagramView | null = query.get('view') as DiagramView;
        const notifyUser: string | null = query.get('notifyUser');
        if (view) {
          switch (view) {
            case DiagramView.SEE_FEEDBACK:
              this.props.changeEditorMode(ApollonMode.Assessment);
              this.props.changeReadonlyMode(true);
              break;
            case DiagramView.GIVE_FEEDBACK:
              this.props.changeEditorMode(ApollonMode.Assessment);
              this.props.changeReadonlyMode(false);
              break;
            case DiagramView.EDIT:
              this.props.changeEditorMode(ApollonMode.Modelling);
              this.props.changeReadonlyMode(false);
              break;
            case DiagramView.COLLABORATE:
              this.props.changeEditorMode(ApollonMode.Modelling);
              this.props.changeReadonlyMode(false);
              // Enforces users to have color assigned to them
              if (!this.props.collaborationName || !this.props.collaborationColor) {
                this.props.openModal(ModalContentType.CollaborationModal, 'lg');
              }
              this.establishCollaborationConnection(token, this.props.collaborationName, this.props.collaborationColor);
              if (notifyUser === 'true') {
                this.displayToast();
                window.history.replaceState({}, document.title, window.location.pathname + '?view=' + view);
              }
              break;
          }
        }

        if (view !== DiagramView.COLLABORATE) {
          // this check fails in development setting because webpack dev server url !== deployment url
          DiagramRepository.getDiagramFromServerByToken(token).then((diagram) => {
            if (diagram) {
              this.props.importDiagram(JSON.stringify(diagram));

              // get query param
              const queryParam = new URLSearchParams(this.props.location.search);
              const diagramView: DiagramView | null = queryParam.get('view') as DiagramView;
              if (diagramView) {
                switch (diagramView) {
                  case DiagramView.SEE_FEEDBACK:
                    this.props.changeEditorMode(ApollonMode.Assessment);
                    this.props.changeReadonlyMode(true);
                    break;
                  case DiagramView.GIVE_FEEDBACK:
                    this.props.changeEditorMode(ApollonMode.Assessment);
                    this.props.changeReadonlyMode(false);
                    break;
                  case DiagramView.EDIT:
                    this.props.changeEditorMode(ApollonMode.Modelling);
                    this.props.changeReadonlyMode(false);
                    break;
                }
              }
            }
          });
        }
      }
    }
  }

  displayToast = () => {
    toast.success(
      'The link has been copied to your clipboard and can be shared to Collaborate, simply by pasting the link. You can re-access the link by going to share menu.',
      {
        autoClose: 10000,
      },
    );
  };

  establishCollaborationConnection(token: string, name: string, color: string) {
    this.client = new W3CWebSocket(`wss://${NO_HTTP_URL}`);
    this.client.onopen = () => {
      const collaborators = { name, color };
      this.client.send(JSON.stringify({ token, collaborators }));
    };
    this.client.onmessage = (message: any) => {
      const { collaborators, diagram } = JSON.parse(message.data);
      if (collaborators) {
        this.props.updateCollaborators(collaborators);
      }
      if (diagram) {
        this.props.importDiagram(JSON.stringify(diagram));
      }
    };
  }

  setCollaborationConnectionName() {
    const { collaborationName, collaborationColor } = this.props;
    this.client.send(JSON.stringify({ collaborators: { name: collaborationName, color: collaborationColor } }));
  }

  hideSelfFromSelectedList = () => {
    const selfElementId = document.getElementById(this.props.collaborationName + '_' + this.props.collaborationColor)!;
    if (selfElementId) selfElementId.style.display = 'none';
  };

  render() {
    // if diagram id or editor mode changes -> redraw
    const key =
      (this.props.diagram?.id || uuid()) +
      this.props.options.mode +
      this.props.options.type +
      this.props.options.readonly;
    return <ApollonContainer key={key} ref={this.containerRef} />;
  }
}

export const ApollonEditorWrapper = enhance(ApollonEditorComponent);

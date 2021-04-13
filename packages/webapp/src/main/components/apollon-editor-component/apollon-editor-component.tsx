import { ApollonEditor, ApollonMode, ApollonOptions, UMLModel } from '@ls1intum/apollon';
import React, { Component, ComponentClass } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { DiagramView } from 'shared/src/main/diagram-view';
import styled from 'styled-components';
//@ts-ignore
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { APPLICATION_SERVER_VERSION, DEPLOYMENT_URL } from '../../constant';
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

const ApollonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
`;

type OwnProps = {};

type RouteProps = {
  token: string | undefined;
};

type State = {};

type StateProps = {
  diagram: Diagram | null;
  options: ApollonOptions;
  fromServer: boolean;
  collaborationName: string;
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

type Props = OwnProps & StateProps & DispatchProps & ApollonEditorContext & RouteComponentProps<RouteProps>;

const enhance = compose<ComponentClass<OwnProps>>(
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
      },
      fromServer: state.share.fromServer,
      collaborationName: state.share.collaborationName,
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
      if (this.props.collaborationName !== prevProps.collaborationName) {
        this.setCollaborationConnectionName();
      }
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
            const { token } = this.props.match.params;
            const { collaborationName } = this.props;
            this.client.send(JSON.stringify({ token, name: collaborationName, diagram }));
          }
        });
        editor.subscribeToModelChange((model: UMLModel) => {
          const diagram: Diagram = { ...this.props.diagram, model } as Diagram;
          this.props.updateDiagram(diagram);
        });
        this.props.setEditor(editor);
      }
    };
    if (APPLICATION_SERVER_VERSION && DEPLOYMENT_URL) {
      // hosted with backend
      const { token } = this.props.match.params;
      if (token) {
        // get query param
        const query = new URLSearchParams(this.props.location.search);
        const view: DiagramView | null = query.get('view') as DiagramView;
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
              if (!this.props.collaborationName) {
                this.props.openModal(ModalContentType.CollaborationModal, 'lg');
              }
              this.establishCollaborationConnection(token, this.props.collaborationName);
              break;
          }
        }

        if (view !== DiagramView.COLLABORATE) {
          // this check fails in development setting because webpack dev server url !== deployment url
          DiagramRepository.getDiagramFromServerByToken(token).then((diagram) => {
            if (diagram) {
              this.props.importDiagram(JSON.stringify(diagram));

              // get query param
              const query = new URLSearchParams(this.props.location.search);
              const view: DiagramView | null = query.get('view') as DiagramView;
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
                }
              }
            }
          });
        }
      }
    }
  }

  establishCollaborationConnection(token: string, name: string) {
    this.client = new W3CWebSocket('ws://localhost:8080');
    this.client.onopen = () => {
      this.client.send(JSON.stringify({ token, name }));
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
    const { collaborationName } = this.props;
    this.client.send(JSON.stringify({ name: collaborationName }));
  }

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

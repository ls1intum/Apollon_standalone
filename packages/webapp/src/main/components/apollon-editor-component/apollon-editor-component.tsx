import React, { Component, ComponentClass } from 'react';
import { ApollonEditor, ApollonMode, ApollonOptions, UMLModel } from '@ls1intum/apollon';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import { withApollonEditor } from './with-apollon-editor';
import { ApollonEditorContext } from './apollon-editor-context';
import { Diagram } from '../../services/diagram/diagram-types';
import { DiagramRepository } from '../../services/diagram/diagram-repository';
import { uuid } from '../../utils/uuid';
import { APPLICATION_SERVER_VERSION, DEPLOYMENT_URL } from '../../constant';
import { EditorOptionsRepository } from '../../services/editor-options/editor-options-repository';
import { DiagramView } from 'shared/src/main/diagram-view';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ImportRepository } from '../../services/import/import-repository';
//@ts-ignore
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { ShareRepository } from '../../services/share/share-repository';

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
};

type DispatchProps = {
  updateDiagram: typeof DiagramRepository.updateDiagram;
  importDiagram: typeof ImportRepository.importJSON;
  changeEditorMode: typeof EditorOptionsRepository.changeEditorMode;
  changeReadonlyMode: typeof EditorOptionsRepository.changeReadonlyMode;
  updateClientCount: typeof ShareRepository.updateClientCount;
  gotFromServer: typeof ShareRepository.gotFromServer;
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
    }),
    {
      updateDiagram: DiagramRepository.updateDiagram,
      importDiagram: ImportRepository.importJSON,
      changeEditorMode: EditorOptionsRepository.changeEditorMode,
      changeReadonlyMode: EditorOptionsRepository.changeReadonlyMode,
      updateClientCount: ShareRepository.updateClientCount,
      gotFromServer: ShareRepository.gotFromServer,
    },
  ),
);

class ApollonEditorComponent extends Component<Props, State> {
  private readonly containerRef: (element: HTMLDivElement) => void;
  private ref?: HTMLDivElement;
  private client: any;

  constructor(props: Props) {
    super(props);
    this.containerRef = (element: HTMLDivElement) => {
      this.ref = element;
      if (this.ref) {
        const editor = new ApollonEditor(this.ref, this.props.options);
        editor.subscribeToModelChange((model: UMLModel) => {
          const diagram: Diagram = { ...this.props.diagram, model } as Diagram;
          this.props.updateDiagram(diagram);
          if (this.client && !this.props.fromServer) {
            const { token } = this.props.match.params;
            this.client.send(JSON.stringify({ token, diagram }));
          }
          this.props.gotFromServer(false);
        });
        this.props.setEditor(editor);
      }
    };
    if (APPLICATION_SERVER_VERSION && DEPLOYMENT_URL) {
      // hosted with backend
      const { token } = this.props.match.params;
      if (token) {
        this.client = new W3CWebSocket('ws://localhost:8080');
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
        this.client.onopen = () => {
          this.client.send(JSON.stringify({ token }));
        };
        this.client.onmessage = (message: any) => {
          console.log(message);
          const { count, diagram } = JSON.parse(message.data);
          if (count) {
            this.props.updateClientCount(count);
          }
          if (diagram) {
            this.props.gotFromServer(true);
            this.props.importDiagram(JSON.stringify(diagram));
          }
        };
        // this check fails in development setting because webpack dev server url !== deployment url
        // DiagramRepository.getDiagramFromServerByToken(token).then((diagram) => {
        //   if (diagram) {
        //     this.props.importDiagram(JSON.stringify(diagram));

        //     // get query param
        //     const query = new URLSearchParams(this.props.location.search);
        //     const view: DiagramView | null = query.get('view') as DiagramView;
        //     if (view) {
        //       switch (view) {
        //         case DiagramView.SEE_FEEDBACK:
        //           this.props.changeEditorMode(ApollonMode.Assessment);
        //           this.props.changeReadonlyMode(true);
        //           break;
        //         case DiagramView.GIVE_FEEDBACK:
        //           this.props.changeEditorMode(ApollonMode.Assessment);
        //           this.props.changeReadonlyMode(false);
        //           break;
        //         case DiagramView.EDIT:
        //           this.props.changeEditorMode(ApollonMode.Modelling);
        //           this.props.changeReadonlyMode(false);
        //           break;
        //       }
        //     }
        //   }
        // });
      }
    }
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

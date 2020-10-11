import React, { Component, ComponentClass } from 'react';
import { ApollonEditor, ApollonOptions, UMLModel } from '@ls1intum/apollon';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import { withApollonEditor } from './with-apollon-editor';
import { ApollonEditorContext } from './apollon-editor-context';
import { Diagram } from '../../services/diagram/diagram-types';
import { DiagramRepository } from '../../services/diagram/diagram-repository';
import { uuid } from '../../utils/uuid';
import { DEPLOYMENT_URL } from '../../constant';
import { ImportRepository } from '../../services/import/import-repository';

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
};

type DispatchProps = {
  updateDiagram: typeof DiagramRepository.updateDiagram;
  importDiagram: typeof ImportRepository.importJSON;
};

type Props = OwnProps & StateProps & DispatchProps & ApollonEditorContext;

const enhance = compose<ComponentClass<OwnProps>>(
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
        model: state.diagram?.model,
        theme: state.editorOptions.theme,
        locale: state.editorOptions.locale,
      },
    }),
    {
      updateDiagram: DiagramRepository.updateDiagram,
      importDiagram: ImportRepository.importJSON,
    },
  ),
);

class ApollonEditorComponent extends Component<Props, State> {
  private readonly containerRef: (element: HTMLDivElement) => void;
  private ref?: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.containerRef = (element: HTMLDivElement) => {
      this.ref = element;
      if (this.ref) {
        const editor = new ApollonEditor(this.ref, this.props.options);
        editor.subscribeToModelChange((model: UMLModel) => {
          const diagram: Diagram = { ...this.props.diagram, model } as Diagram;
          this.props.updateDiagram(diagram);
        });
        this.props.setEditor(editor);
        this.setState({ forceRecreate: false });
      }
    };
    if (DEPLOYMENT_URL) {
      // hosted with backend
      const url = window.location.href;
      if (url !== DEPLOYMENT_URL) {
        // this check fails in development setting because webpack dev server url !== deployment url
        DiagramRepository.getDiagramFromServerByLink(url).then((diagram) => {
          if (diagram) {
            console.log(diagram.model?.type);
            this.props.importDiagram(JSON.stringify(diagram));
          }
        });
      }
    }
  }

  render() {
    // if diagram id or editor mode changes -> redraw
    const key = (this.props.diagram?.id || uuid()) + this.props.options.mode;
    return <ApollonContainer key={key} ref={this.containerRef} />;
  }
}

export const ApollonEditorWrapper = enhance(ApollonEditorComponent);

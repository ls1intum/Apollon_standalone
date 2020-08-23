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

const ApollonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
`;

type OwnProps = {};

type State = {
  forceRecreate: boolean;
};

type StateProps = {
  diagram: Diagram | null;
  options: ApollonOptions;
};

type DispatchProps = {
  updateDiagram: typeof DiagramRepository.updateDiagram;
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
    },
  ),
);

class ApollonEditorComponent extends Component<Props, State> {
  state = { forceRecreate: false };
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
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if (
      this.props.options.model === undefined &&
      JSON.stringify(this.props.options.model) !== JSON.stringify(prevProps.options.model)
    ) {
      this.setState({ forceRecreate: true });
    }
  }

  render() {
    const { model, ...apollonOptions } = this.props.options;
    // json stringify of apollon options, except for model -> key changes when apollon options are changed -> component is rerendered
    return (
      <ApollonContainer
        key={JSON.stringify({ ...apollonOptions, ...{ forceRecreate: this.state.forceRecreate } })}
        ref={this.containerRef}
      />
    );
  }
}

export const ApollonEditorWrapper = enhance(ApollonEditorComponent);

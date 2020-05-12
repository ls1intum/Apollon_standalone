import React, { Component, ComponentClass } from 'react';
import { ApollonEditor, ApollonOptions, UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import styled from 'styled-components';
import { compose, DeepPartial } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import { withApollonEditor } from './with-apollon-editor';
import { ApollonEditorContext } from './apollon-editor-context';
import { unmountComponentAtNode } from 'react-dom';
import { Diagram } from '../../services/local-storage/local-storage-types';
import { ApollonMode, Locale } from '@ls1intum/apollon/lib/services/editor/editor-types';
import { Styles } from '@ls1intum/apollon/lib/components/theme/styles';

const ApollonContainer = styled.div`
  display: flex;
  flex-grow: 2;
  margin: 20px;
`;

type OwnProps = {};

type State = {};

type StateProps = {
  options: ApollonOptions;
};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps & ApollonEditorContext;

const enhance = compose<ComponentClass<OwnProps>>(
  withApollonEditor,
  connect<StateProps, DispatchProps, OwnProps, ApplicationState>((state) => {
    console.log(state.diagram?.model);
    return {
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
    };
  }, {}),
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
        editor.subscribeToModelChange(() => console.log('changed'));
        this.props.setEditor(editor);
      }
    };
  }

  render() {
    // json stringify of model -> key changes when model are changed -> component is rerendered
    return <ApollonContainer key={JSON.stringify({ ...this.props.options })} ref={this.containerRef} />;
  }
}

export const ApollonEditorWrapper = enhance(ApollonEditorComponent);

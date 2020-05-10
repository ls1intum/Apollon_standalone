import React, { Component, ComponentClass } from 'react';
import { ApollonEditor, ApollonOptions, UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import { withApollonEditor } from './with-apollon-editor';
import { ApollonEditorContext } from './apollon-editor-context';
import { unmountComponentAtNode } from 'react-dom';

const ApollonContainer = styled.div`
  display: flex;
  flex-grow: 2;
  margin: 20px;
`;

type OwnProps = {};

type State = {};

type StateProps = {
  model: ApollonOptions;
};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps & ApollonEditorContext;

const enhance = compose<ComponentClass<OwnProps>>(
  withApollonEditor,
  connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
    (state) => ({
      model: { model: null, ...state.diagram?.model } as ApollonOptions,
    }),
    {},
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
        this.props.setEditor(new ApollonEditor(this.ref, this.props.model));
      }
    };
  }
  render() {
    // json stringify of model -> key changes when model are changed -> component is rerendered
    return <ApollonContainer key={JSON.stringify({ ...this.props.model })} ref={this.containerRef} />;
  }
}

export const ApollonEditorWrapper = enhance(ApollonEditorComponent);

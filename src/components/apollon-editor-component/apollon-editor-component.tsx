import React, { Component, ComponentClass } from 'react';
import { ApollonEditor, ApollonOptions } from '@ls1intum/apollon';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import { withApollonEditor } from './with-apollon-editor';
import { ApollonEditorContext } from './apollon-editor-context';

const ApollonContainer = styled.div`
  display: flex;
  flex-grow: 2;
  margin: 20px;
`;

type OwnProps = {};

type StateProps = {
  options: ApollonOptions;
};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps & ApollonEditorContext;

const enhance = compose<ComponentClass<OwnProps>>(
  withApollonEditor,
  connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
    (state) => ({
      options: {
        model: state.model!,
      },
    }),
    {},
  ),
);

class ApollonEditorComponent extends Component<Props> {
  private readonly containerRef: (element: HTMLDivElement) => void;
  constructor(props: Props) {
    super(props);
    this.containerRef = (element: HTMLDivElement) => {
      // can be ignored, its the way to initialize apollon-editior
      console.log(this.props);
      // tslint:disable-next-line
      this.props.setEditor(new ApollonEditor(element, this.props.options));
    };
  }

  render() {
    return <ApollonContainer ref={this.containerRef} />;
  }
}

export const ApollonEditorWrapper = enhance(ApollonEditorComponent);

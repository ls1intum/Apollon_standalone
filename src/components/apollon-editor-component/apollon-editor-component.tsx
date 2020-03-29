import React, { Component } from 'react';
import { ApollonEditor, ApollonOptions } from '@ls1intum/apollon';
import styled from 'styled-components';

type Props = {
  options: ApollonOptions;
};

const ApollonContainer = styled.div`
  display: flex;
  flex-grow: 2;
  margin: 20px;
`;

export class ApollonEditorComponent extends Component<Props> {
  private readonly containerRef: (element: HTMLDivElement) => void;
  constructor(props: Props) {
    super(props);
    this.containerRef = (element: HTMLDivElement) => {
      // can be ignored, its the way to initialize apollon-editior
      // tslint:disable-next-line
      new ApollonEditor(element, this.props.options);
    };
  }

  render() {
    return <ApollonContainer ref={this.containerRef} />;
  }
}

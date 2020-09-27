import { ApollonEditorContext, ApollonEditorConsumer } from './apollon-editor-context';
import React, { Component, ComponentType, forwardRef } from 'react';

export const withApollonEditor = <P extends ApollonEditorContext, C extends Component>(
  WrappedComponent: ComponentType<P>,
) =>
  forwardRef<C, Pick<P, Exclude<keyof P, keyof ApollonEditorContext>>>((props, ref) => (
    <ApollonEditorConsumer>
      {(context) => <WrappedComponent ref={ref} {...(props as P)} {...context} />}
    </ApollonEditorConsumer>
  ));

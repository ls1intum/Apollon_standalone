import React from 'react';
import { ApplicationBarComponent } from './components/application-bar/application-bar';
import { ApollonEditorWrapper } from './components/apollon-editor-component/apollon-editor-component';
import { ApollonEditor, ApollonOptions } from '@ls1intum/apollon';
import { createGlobalStyle } from 'styled-components';
import { ApplicationStore } from './components/store/application-store';
import { ApplicationState } from './components/store/application-state';
import { Diagram } from './services/local-storage/local-storage-types';
import { localStorageDiagramPrefix, localStorageLatest } from './constant';
import {
  ApollonEditorContext,
  ApollonEditorProvider,
} from './components/apollon-editor-component/apollon-editor-context';
import { uuid } from './utils/uuid';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
         Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 0;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`;

type Props = {};

type State = {
  options?: ApollonOptions;
  editor?: ApollonEditor;
};

const initialState: State = Object.freeze({
  model: undefined as ApollonOptions | undefined,
  editor: undefined as ApollonEditor | undefined,
});

const getInitialStore = (): ApplicationState => {
  const latestId: string | null = window.localStorage.getItem(localStorageLatest);
  let localState: ApplicationState;
  if (latestId) {
    const latestDiagram: Diagram = JSON.parse(window.localStorage.getItem(localStorageDiagramPrefix + latestId)!);
    localState = { diagram: latestDiagram };
  } else {
    localState = { diagram: { id: uuid(), title: '', model: {}, lastUpdate: new Date() } };
  }
  return localState;
};

const initialStore = getInitialStore();

export class Application extends React.Component<Props, State> {
  state = initialState;
  setEditor = (ref: ApollonEditor) => {
    if (ref) {
      this.setState({ editor: ref });
    }
  };

  render() {
    const context: ApollonEditorContext | null = this.state.editor
      ? { editor: this.state.editor, setEditor: this.setEditor }
      : { editor: undefined, setEditor: this.setEditor };
    return (
      <ApollonEditorProvider value={context}>
        <ApplicationStore initialState={initialStore}>
          <GlobalStyle />
          <ApplicationBarComponent></ApplicationBarComponent>
          <ApollonEditorWrapper />
        </ApplicationStore>
      </ApollonEditorProvider>
    );
  }
}

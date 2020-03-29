import React from 'react';
import { ApplicationBarComponent } from './components/application-bar/application-bar';
import { ApollonEditorWrapper } from './components/apollon-editor-component/apollon-editor-component';
import { ApollonEditor, ApollonOptions, UMLModel } from '@ls1intum/apollon';
import { createGlobalStyle } from 'styled-components';
import { ApplicationStore } from './components/store/application-store';
import { ApplicationState } from './components/store/application-state';
import { StorageStructure, StoreAction } from './services/local-storage/local-storage-types';
import {
  ApollonEditorContext,
  ApollonEditorProvider,
} from './components/apollon-editor-component/apollon-editor-context';

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
  options: undefined as ApollonOptions | undefined,
  editor: undefined as ApollonEditor | undefined,
});

function* idGenerator(count: number): IterableIterator<number> {
  while (true) yield count++;
}

const getInitialStore = (): ApplicationState => {
  const localSaved: StorageStructure = JSON.parse(window.localStorage.getItem('apollon')!);
  let localState;
  if (localSaved) {
    const latestDiagram: UMLModel | null =
      localSaved && localSaved.latest && localSaved.models.some((item) => item.id === localSaved.latest)
        ? localSaved.models.find((item) => item.id === localSaved.latest)!.model
        : null;
    const generator = idGenerator(localSaved.sequence);
    localState = { model: latestDiagram, idGenerator: generator };
  } else {
    localState = { model: null, idGenerator: idGenerator(0) };
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

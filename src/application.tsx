import React from 'react';
import { ApplicationBar } from './components/application-bar/application-bar';
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
import moment from 'moment';
import { FirefoxIncompatibilityHint } from './components/incompatability-hints/firefox-incompatibility-hint';
import { defaultEditorOptions } from './services/editor-options/editor-options-reducer';
import { EditorOptions } from './services/editor-options/editor-options-types';
import { ErrorPanel } from './components/error-handling/error-panel';

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
  let diagram: { diagram: Diagram };
  let editorOptions: EditorOptions = defaultEditorOptions;
  if (latestId) {
    const latestDiagram: Diagram = JSON.parse(window.localStorage.getItem(localStorageDiagramPrefix + latestId)!);
    diagram = { diagram: latestDiagram };
    editorOptions.type = latestDiagram.model?.type ? latestDiagram.model.type : editorOptions.type;
  } else {
    diagram = { diagram: { id: uuid(), title: 'UMLClassDiagram', model: undefined, lastUpdate: moment() } };
  }

  // initial application state
  return {
    ...diagram,
    editorOptions: editorOptions,
    errors: [],
  };
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
    const isFirefox: boolean = /Firefox/i.test(navigator.userAgent);
    const context: ApollonEditorContext | null = { editor: this.state.editor, setEditor: this.setEditor };
    return (
      <ApollonEditorProvider value={context}>
        <ApplicationStore initialState={initialStore}>
          <ApplicationBar />
          {isFirefox && <FirefoxIncompatibilityHint></FirefoxIncompatibilityHint>}
          <ErrorPanel />
          <ApollonEditorWrapper />
        </ApplicationStore>
      </ApollonEditorProvider>
    );
  }
}

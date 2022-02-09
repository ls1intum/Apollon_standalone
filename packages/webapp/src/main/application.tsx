import React from 'react';
import { ApplicationBar } from './components/application-bar/application-bar.js';
import { ApollonEditorWrapper } from './components/apollon-editor-component/apollon-editor-component.js';
import { ApollonEditor, ApollonOptions } from '@ls1intum/apollon';
import { ApplicationStore } from './components/store/application-store.js';
import { ApplicationState } from './components/store/application-state.js';
import { localStorageCollaborationName, localStorageDiagramPrefix, localStorageLatest } from './constant.js';
import {
  ApollonEditorContext,
  ApollonEditorProvider,
} from './components/apollon-editor-component/apollon-editor-context.js';
import { uuid } from './utils/uuid.js';
import moment from 'moment';
import { FirefoxIncompatibilityHint } from './components/incompatability-hints/firefox-incompatibility-hint.js';
import { defaultEditorOptions } from './services/editor-options/editor-options-reducer.js';
import { EditorOptions } from './services/editor-options/editor-options-types.js';
import { ErrorPanel } from './components/error-handling/error-panel.js';
import { Diagram } from './services/diagram/diagram-types.js';
import { BrowserRouter, RouteComponentProps, Route, Switch } from 'react-router-dom';
import { ApplicationModal } from './components/modals/application-modal.js';

type OwnProps = {};

type Props = OwnProps & RouteComponentProps;

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
  const editorOptions: EditorOptions = defaultEditorOptions;
  if (latestId) {
    const latestDiagram: Diagram = JSON.parse(window.localStorage.getItem(localStorageDiagramPrefix + latestId)!);
    diagram = { diagram: latestDiagram };
    editorOptions.type = latestDiagram?.model?.type ? latestDiagram.model.type : editorOptions.type;
  } else {
    diagram = {
      diagram: { id: uuid(), title: 'UMLClassDiagram', model: undefined, lastUpdate: moment() },
    };
  }

  // initial application state
  return {
    ...diagram,
    editorOptions,
    errors: [],
    modal: {
      type: null,
      size: 'sm',
    },
    share: {
      collaborationName: window.localStorage.getItem(localStorageCollaborationName) || '',
      collaborators: [],
      fromServer: false,
    },
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
          <ApplicationModal />
          {isFirefox && <FirefoxIncompatibilityHint />}
          <ErrorPanel />
          <ApollonEditorWrapper />
        </ApplicationStore>
      </ApollonEditorProvider>
    );
  }
}

export function RoutedApplication() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={'/:token'} render={(props) => <Application {...props} />} />
        <Route path={'/'} render={(props) => <Application {...props} />} />
      </Switch>
    </BrowserRouter>
  );
}

import React, { useState } from 'react';
import { ApplicationBar } from './components/application-bar/application-bar';
import { ApollonEditorWrapper } from './components/apollon-editor-component/apollon-editor-component';
import { ApollonEditor } from '@ls1intum/apollon';
import { ApplicationStore } from './components/store/application-store';
import { ApplicationState } from './components/store/application-state';
import {
  localStorageCollaborationColor,
  localStorageCollaborationName,
  localStorageDiagramPrefix,
  localStorageLatest,
  POSTHOG_HOST,
  POSTHOG_KEY,
} from './constant';
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
import { Diagram } from './services/diagram/diagram-types';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ApplicationModal } from './components/modals/application-modal';
import { ToastContainer } from 'react-toastify';
import { PostHogProvider } from 'posthog-js/react';

const postHogOptions = {
  api_host: POSTHOG_HOST,
};

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
      collaborationColor: window.localStorage.getItem(localStorageCollaborationColor) || '',
      collaborators: [],
      fromServer: false,
    },
    sidebar: {
      displaySidebar: false,
    },
  };
};

const initialStore = getInitialStore();

export const Application = () => {
  const [editor, setEditor] = useState<ApollonEditor>();
  const handleSetEditor = (ref: ApollonEditor) => {
    if (ref) {
      setEditor(ref);
    }
  };
  const isFirefox: boolean = /Firefox/i.test(navigator.userAgent);
  const context: ApollonEditorContext | null = { editor, setEditor: handleSetEditor };

  return (
    <PostHogProvider apiKey={POSTHOG_KEY} options={postHogOptions}>
      <ApollonEditorProvider value={context}>
        <ApplicationStore initialState={initialStore}>
          <ApplicationBar />
          <ApplicationModal />
          {isFirefox && <FirefoxIncompatibilityHint />}
          <ErrorPanel />
          <ApollonEditorWrapper />
        </ApplicationStore>
        <ToastContainer />
      </ApollonEditorProvider>
    </PostHogProvider>
  );
};

export function RoutedApplication() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/:token'} element={<Application />} />
        <Route path={'/'} element={<Application />} />
      </Routes>
    </BrowserRouter>
  );
}

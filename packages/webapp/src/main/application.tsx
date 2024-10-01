import React, { useState } from 'react';
import { ApplicationBar } from './components/application-bar/application-bar';
import { ApollonEditorComponent } from './components/apollon-editor-component/apollon-editor-component';
import { ApollonEditor } from '@ls1intum/apollon';
import {
  POSTHOG_HOST,
  POSTHOG_KEY,
} from './constant';
import {
  ApollonEditorProvider,
  
} from './components/apollon-editor-component/apollon-editor-context';
import { FirefoxIncompatibilityHint } from './components/incompatability-hints/firefox-incompatibility-hint';
import { ErrorPanel } from './components/error-handling/error-panel';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ApplicationModal } from './components/modals/application-modal';
import { ToastContainer } from 'react-toastify';
import { PostHogProvider } from 'posthog-js/react';
import { ApplicationStore } from './components/store/application-store';

const postHogOptions = {
  api_host: POSTHOG_HOST,
};


export const Application = () => {
  const [editor, setEditor] = useState<ApollonEditor>();
  const handleSetEditor = (newEditor: ApollonEditor) => {
      setEditor(newEditor);
  };
  const isFirefox = /Firefox/i.test(navigator.userAgent);

  return (
    <PostHogProvider apiKey={POSTHOG_KEY} options={postHogOptions}>
      <ApollonEditorProvider value={{ editor, setEditor: handleSetEditor }}>
        <ApplicationStore >
          <ApplicationBar />
          <ApplicationModal />
          {isFirefox && <FirefoxIncompatibilityHint />}
          <ErrorPanel />
          <ApollonEditorComponent />
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

import React, { useState } from 'react';
import { ApplicationBar } from './components/application-bar/application-bar';
import { ApollonEditorWrapper } from './components/apollon-editor-component/apollon-editor-component';
import { ApollonEditor } from '@ls1intum/apollon';
import {
  POSTHOG_HOST,
  POSTHOG_KEY,
} from './constant';
import {
  ApollonEditorContext,
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
        <ApplicationStore >
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

import React, { useMemo, useState } from 'react';
import { ApplicationBar } from './components/application-bar/application-bar';
import { ApollonEditorComponent } from './components/apollon-editor-component/ApollonEditorComponent';
import { ApollonEditor } from '@ls1intum/apollon';
import { POSTHOG_HOST, POSTHOG_KEY } from './constant';
import { ApollonEditorProvider } from './components/apollon-editor-component/apollon-editor-context';
import { FirefoxIncompatibilityHint } from './components/incompatability-hints/firefox-incompatibility-hint';
import { ErrorPanel } from './components/error-handling/error-panel';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ApplicationModal } from './components/modals/application-modal';
import { ToastContainer } from 'react-toastify';
import { PostHogProvider } from 'posthog-js/react';
import { ApplicationStore } from './components/store/application-store';
import { ApollonEditorComponentWithConnection } from './components/apollon-editor-component/ApollonEditorComponentWithConnection';
import { useAppSelector } from './components/store/hooks';
import { selectDisplaySidebar } from './services/version-management/versionManagementSlice';
import { VersionManagementSidebar } from './components/version-management-sidebar/version-management-sidebar';

const postHogOptions = {
  api_host: POSTHOG_HOST,
};

export function RoutedApplication() {
  const [editor, setEditor] = useState<ApollonEditor>();
  const handleSetEditor = (newEditor: ApollonEditor) => {
    setEditor(newEditor);
  };
  const isFirefox = useMemo(() => /Firefox/i.test(navigator.userAgent), []);

  return (
    <PostHogProvider apiKey={POSTHOG_KEY} options={postHogOptions}>
      <ApplicationStore>
        <BrowserRouter>
          <ApollonEditorProvider value={{ editor, setEditor: handleSetEditor }}>
            <ApplicationBar />
            <ApplicationModal />

            {/* This component should be here with absolute display */}
            <VersionManagementSidebar />
            {isFirefox && <FirefoxIncompatibilityHint />}
            <Routes>
              <Route path={'/:token'} element={<ApollonEditorComponentWithConnection />} />
              <Route path={'/'} element={<ApollonEditorComponent />} />
            </Routes>
            <ErrorPanel />
            <ToastContainer />
          </ApollonEditorProvider>
        </BrowserRouter>
      </ApplicationStore>
    </PostHogProvider>
  );
}

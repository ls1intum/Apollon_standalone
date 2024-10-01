import React from 'react';
import { combineReducers, PreloadedState } from 'redux';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import {
  localStorageLatest,
  localStorageDiagramPrefix,
  localStorageCollaborationName,
  localStorageCollaborationColor,
} from '../../constant';
import { defaultEditorOptions } from '../../services/editor-options/editor-options-reducer';
import { EditorOptions } from '../../services/editor-options/editor-options-types';
import { uuid } from '../../utils/uuid';
import { reducers } from '../../services/reducer';
import { Diagram, DiagramState } from '../../services/diagram/diagramSlice';
import { ApollonError } from '../../services/error-management/error-types';
import { ModalState } from '../../services/modal/modal-types';
import { ShareState } from '../../services/share/share-types';

interface ApplicationState {
  diagram: DiagramState;
  editorOptions: EditorOptions;
  errors: ApollonError[];
  modal: ModalState;
  share: ShareState;
}

const getInitialStore = (): ApplicationState => {
  const latestId: string | null = window.localStorage.getItem(localStorageLatest);
  let diagram: Diagram;
  const editorOptions: EditorOptions = defaultEditorOptions;

  if (latestId) {
    const latestDiagram: Diagram = JSON.parse(window.localStorage.getItem(localStorageDiagramPrefix + latestId)!);
    diagram = latestDiagram;
    editorOptions.type = latestDiagram?.model?.type ? latestDiagram.model.type : editorOptions.type;
  } else {
    diagram = { id: uuid(), title: 'UMLClassDiagram', model: undefined, lastUpdate: moment() };
  }

  // initial application state
  return {
    diagram: {
      diagram,
      error: null,
      loading: false,
    },
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
  };
};

const store = configureStore({
  reducer: combineReducers(reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  preloadedState: getInitialStore(),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in non-production environments
});

interface Props {
  children: React.ReactNode;
}

export const ApplicationStore: React.FC<Props> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

import { Reducer } from 'redux';
import { Actions } from '../actions';
import { EditorOptions, EditorOptionsActionTypes } from './editor-options-types';
import { UMLDiagramType } from '@ls1intum/apollon';
import { ApollonMode, Locale } from '@ls1intum/apollon/lib/services/editor/editor-types';

export const defaultEditorOptions = {
  type: UMLDiagramType.ClassDiagram,
  mode: ApollonMode.Modelling,
  readonly: false,
  enablePopups: true,
  enableCopyPaste: true,
  locale: Locale.en,
};

export const EditorOptionsReducer: Reducer<EditorOptions, Actions> = (state = defaultEditorOptions, action) => {
  // state is set in application.tsx -> always a state
  switch (action.type) {
    case EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE: {
      const type = action.payload.type as UMLDiagramType;
      return { ...state, type };
    }
    case EditorOptionsActionTypes.CHANGE_EDITOR_MODE: {
      const mode = action.payload.mode;
      return { ...state, mode };
    }
    case EditorOptionsActionTypes.CHANGE_READONLY_MODE: {
      const readonly = action.payload.readonly;
      return { ...state, readonly };
    }
  }

  return state;
};

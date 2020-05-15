import { Reducer } from 'redux';
import { Actions } from '../actions';
import { EditorOptions, EditorOptionsActionTypes } from './editor-options-types';
import { UMLDiagramType } from '@ls1intum/apollon';

export const EditorOptionsReducer: Reducer<EditorOptions, Actions> = (state, action) => {
  // state is set in application.tsx -> always a state
  switch (action.type) {
    case EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE: {
      const type = action.payload.type as UMLDiagramType;
      return { ...state!, type };
    }
  }

  return state!;
};

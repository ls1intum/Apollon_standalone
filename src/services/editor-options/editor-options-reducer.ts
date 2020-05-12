import { Reducer } from 'redux';
import { Actions } from '../actions';
import { EditorOptions, EditorOptionsActionTypes } from './editor-options-types';

export const EditorOptionsReducer: Reducer<EditorOptions | null, Actions> = (state, action) => {
  switch (action.type) {
    case EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE: {
      const type = action.payload.type;
      return { ...state, type };
    }
  }

  return !state ? null : state;
};

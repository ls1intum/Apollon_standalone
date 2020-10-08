import { Actions } from './actions';
import { ApplicationState } from '../components/store/application-state';
import { ReducersMapObject } from 'redux';
import { EditorOptionsReducer } from './editor-options/editor-options-reducer';
import { DiagramReducer } from './diagram/diagram-reducer';
import { ErrorReducer } from './error-management/error-reducer';

export const reducers: ReducersMapObject<ApplicationState, Actions> = {
  diagram: DiagramReducer,
  editorOptions: EditorOptionsReducer,
  errors: ErrorReducer,
};

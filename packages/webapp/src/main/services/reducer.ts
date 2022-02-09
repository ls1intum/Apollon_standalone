import { Actions } from './actions.js';
import { ApplicationState } from '../components/store/application-state.js';
import { ReducersMapObject } from 'redux';
import { EditorOptionsReducer } from './editor-options/editor-options-reducer.js';
import { DiagramReducer } from './diagram/diagram-reducer.js';
import { ErrorReducer } from './error-management/error-reducer.js';
import { ModalReducer } from './modal/modal-reducer.js';
import { ShareReducer } from './share/share-reducer.js';

export const reducers: ReducersMapObject<ApplicationState, Actions> = {
  diagram: DiagramReducer,
  editorOptions: EditorOptionsReducer,
  errors: ErrorReducer,
  modal: ModalReducer,
  share: ShareReducer,
};

import { Actions } from './actions';
import { ApplicationState } from '../components/store/application-state';
import { ReducersMapObject } from 'redux';
import { EditorOptionsReducer } from './editor-options/editor-options-reducer';
import { ErrorReducer } from './error-management/error-reducer';
import { ModalReducer } from './modal/modal-reducer';
import { ShareReducer } from './share/share-reducer';
import { diagramReducer } from './diagram/diagramSlice';

export const reducers = {
  diagram: diagramReducer,
  editorOptions: EditorOptionsReducer,
  errors: ErrorReducer,
  modal: ModalReducer,
  share: ShareReducer,
};

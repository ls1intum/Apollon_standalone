import { LocalStorageActions } from './local-storage/local-storage-types.js';
import { Action } from 'redux';
import { EditorOptionsActions } from './editor-options/editor-options-types.js';
import { ImportActions } from './import/import-types.js';
import { DiagramActions } from './diagram/diagram-types.js';
import { ErrorActions } from './error-management/error-types.js';
import { ModalActions } from './modal/modal-types.js';
import { ShareActions } from './share/share-types.js';
export type Actions =
  | LocalStorageActions
  | StopAction
  | EditorOptionsActions
  | ImportActions
  | DiagramActions
  | ErrorActions
  | ModalActions
  | ShareActions;

export const enum StopActionType {
  STOP_ACTION = '@@stop_action',
}
export type StopAction = Action<StopActionType.STOP_ACTION>;

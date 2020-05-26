import { LocalStorageActions } from './local-storage/local-storage-types';
import { Action } from 'redux';
import { EditorOptionsActions } from './editor-options/editor-options-types';
import { ImportActions } from './import/import-types';
import { DiagramActions } from './diagram/diagram-types';
import { ErrorActions } from './error-management/error-types';

export type Actions =
  | LocalStorageActions
  | StopAction
  | EditorOptionsActions
  | ImportActions
  | DiagramActions
  | ErrorActions;

export const enum StopActionType {
  STOP_ACTION = '@@stop_action',
}
export type StopAction = Action<StopActionType.STOP_ACTION>;

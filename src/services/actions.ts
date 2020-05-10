import { LocalStorageActions } from './local-storage/local-storage-types';
import { Action } from 'redux';

export type Actions = LocalStorageActions | StopAction;

export const enum StopActionType {
  STOP_ATION = '@@stop_action',
}
export type StopAction = Action<StopActionType.STOP_ATION>;

import { Action } from 'redux';

export type ErrorActions =
  | LoadDiagramErrorAction
  | SaveDiagramErrorAction
  | ImportDiagramErrorAction
  | DismissErrorAction;

export const enum ErrorActionType {
  ERROR_LOAD_DIAGRAM = '@@error/load_diagram',
  ERROR_SAVE_DIAGRAM = '@@error/save-diagram',
  ERROR_IMPORT_DIAGRAM = '@@error/import-diagram',
  DISMISS_ERROR = '@@error/dismiss-error',
}

export type ApollonError = { id: string; headerText: string; bodyText: string };

export type ErrorAction = {
  payload: ApollonError;
};

export type LoadDiagramErrorAction = Action<ErrorActionType.ERROR_LOAD_DIAGRAM> & ErrorAction;
export type SaveDiagramErrorAction = Action<ErrorActionType.ERROR_SAVE_DIAGRAM> & ErrorAction;
export type ImportDiagramErrorAction = Action<ErrorActionType.ERROR_IMPORT_DIAGRAM> & ErrorAction;
export type DismissErrorAction = Action<ErrorActionType.DISMISS_ERROR> & ErrorAction;

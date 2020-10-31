import { Action } from 'redux';

export type ErrorActions = DisplayErrorAction | DismissErrorAction;

export const enum ErrorActionType {
  DISPLAY_ERROR = '@@error/display',
  DISMISS_ERROR = '@@error/dismiss',
}

export type ApollonError = { id: string; headerText: string; bodyText: string };

export type ErrorAction = {
  payload: ApollonError;
};

export type DisplayErrorAction = Action<ErrorActionType.DISPLAY_ERROR> & ErrorAction;
export type DismissErrorAction = Action<ErrorActionType.DISMISS_ERROR> & ErrorAction;

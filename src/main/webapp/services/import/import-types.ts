import { Action } from 'redux';

export type ImportActions = ImportJSONAction;

export const enum ImportActionTypes {
  IMPORT_JSON = '@@import/json',
}

export type ImportJSONAction = Action<ImportActionTypes.IMPORT_JSON> & {
  payload: {
    json: string;
  };
};

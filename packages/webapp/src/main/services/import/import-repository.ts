import { ImportActionTypes, ImportJSONAction } from './import-types.js';

export const ImportRepository = {
  importJSON: (diagramJSON: string): ImportJSONAction => ({
    type: ImportActionTypes.IMPORT_JSON,
    payload: {
      json: diagramJSON,
    },
  }),
};

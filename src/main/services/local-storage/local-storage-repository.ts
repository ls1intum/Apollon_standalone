import { LoadAction, LocalStorageActionTypes, StoreAction } from './local-storage-types';
import { Diagram } from '../diagram/diagram-types';

export const LocalStorageRepository = {
  load: (id: string): LoadAction => ({
    type: LocalStorageActionTypes.LOAD,
    payload: {
      id,
    },
  }),

  store: (diagram: Diagram): StoreAction => ({
    type: LocalStorageActionTypes.STORE,
    payload: {
      diagram,
    },
  }),
};

import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { LoadAction, LocalStorageActionTypes, StoreAction, ValidateStoreAction } from './local-storage-types';

export const LocalStorageRepository = {
  load: (id: string): LoadAction => ({
    type: LocalStorageActionTypes.LOAD,
    payload: {
      id: id,
    },
  }),

  store: (model: UMLModel, identifier: string, sequenceNumber?: number): StoreAction => ({
    type: LocalStorageActionTypes.STORE,
    payload: {
      model,
      identifier,
      sequenceNumber
    },
  }),

  validateStore: (model: UMLModel, identifier?: string): ValidateStoreAction => ({
    type: LocalStorageActionTypes.VALIDATE_STORE_ACTION,
    payload: {
      model,
      identifier,
    },
  }),
};

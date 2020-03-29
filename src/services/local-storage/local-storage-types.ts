import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { Action } from 'redux';

export type StorageStructure = {
  latest?: string;
  sequence: number;
  models: { id: string; model: UMLModel }[];
};

export const enum LocalStorageActionTypes {
  LOAD = '@@local_storage/load',
  LOAD_LATEST = '@@local_storage/load_latest',
  STORE = '@@local_storage/store',
  LIST_STORED = '@@local_storage/list_stored',
  VALIDATE_STORE_ACTION = '@@local_storage/validate_identifier',
}

export type LocalStorageActions = LoadAction | StoreAction;

export type ListStoredDiagramsAction = Action<LocalStorageActionTypes.LIST_STORED> & {
  payload: undefined;
};

export type LoadAction = Action<LocalStorageActionTypes.LOAD> & {
  payload: {
    id: string;
  };
};

type ValidatePayload = {
  payload: {
    model: UMLModel;
    identifier?: string;
  };
};

type StorePayload = {
  payload: {
    model: UMLModel;
    identifier: string;
    sequenceNumber?: number
  };
};

export type StoreAction = Action<LocalStorageActionTypes.STORE> & StorePayload;
export type ValidateStoreAction = Action<LocalStorageActionTypes.VALIDATE_STORE_ACTION> & ValidatePayload;

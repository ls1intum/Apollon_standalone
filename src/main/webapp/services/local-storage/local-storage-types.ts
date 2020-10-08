import { UMLDiagramType } from '@ls1intum/apollon';
import { Action } from 'redux';
import { Moment } from 'moment';
import { Diagram } from '../diagram/diagram-types';

export type LocalStorageDiagramListItem = {
  id: string;
  title: string;
  type: UMLDiagramType;
  lastUpdate: Moment;
};

export type LocalStorageActions = LoadAction | StoreAction;

export const enum LocalStorageActionTypes {
  LOAD = '@@local_storage/load',
  LOAD_LATEST = '@@local_storage/load_latest',
  STORE = '@@local_storage/store',
  LIST_STORED = '@@local_storage/list_stored',
}

export type LoadAction = Action<LocalStorageActionTypes.LOAD> & {
  payload: {
    id: string;
  };
};

type StorePayload = {
  payload: {
    diagram: Diagram;
  };
};

export type StoreAction = Action<LocalStorageActionTypes.STORE> & StorePayload;

import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { Action } from 'redux';
import { Moment } from 'moment';

export type Diagram = {
  id: string;
  title: string;
  model?: UMLModel;
  lastUpdate: Moment;
};

export type LocalStorageDiagramListItem = {
  id: string;
  title: string;
  type: UMLDiagramType;
  lastUpdate: Moment;
};

export type LocalStorageActions = LoadAction | StoreAction | CreateDiagramAction;

export const enum LocalStorageActionTypes {
  CREATE_DIAGRAM = '@@local_storage/create_diagram',
  LOAD = '@@local_storage/load',
  LOAD_LATEST = '@@local_storage/load_latest',
  STORE = '@@local_storage/store',
  LIST_STORED = '@@local_storage/list_stored',
}

export type ListStoredDiagramsAction = Action<LocalStorageActionTypes.LIST_STORED> & {
  payload: undefined;
};

export type LoadAction = Action<LocalStorageActionTypes.LOAD> & {
  payload: {
    id: string;
  };
};

type StorePayload = {
  payload: {
    diagram: Diagram
  };
};

export type StoreAction = Action<LocalStorageActionTypes.STORE> & StorePayload;

export type CreateDiagramAction = Action<LocalStorageActionTypes.CREATE_DIAGRAM> & {
  payload: {
    diagramTitle: string;
    diagramType: UMLDiagramType;
  };
};

import {
  CreateDiagramAction,
  Diagram,
  LoadAction,
  LocalStorageActionTypes,
  LocalStorageDiagramListItem,
  StoreAction,
} from './local-storage-types';
import { ApplicationState } from '../../components/store/application-state';
import { combineEpics, Epic } from 'redux-observable';
import { Action } from 'redux';
import { filter, map, tap } from 'rxjs/operators';
import { localStorageDiagramPrefix, localStorageDiagramsList, localStorageLatest } from '../../constant';
import { StopAction, StopActionType } from '../actions';
import moment from 'moment';
import { uuid } from '../../utils/uuid';
import { ImportActionTypes, ImportJSONAction } from '../import/import-types';
import { UpdateDiagramAction } from '../diagram/diagram-types';
import { DiagramRepository } from '../diagram/diagram-repository';

export const storeEpic: Epic<Action, StopAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.STORE),
    map((action) => action as StoreAction),
    map((action: StoreAction) => {
      let { diagram } = action.payload;
      localStorage.setItem(localStorageDiagramPrefix + diagram.id, JSON.stringify(diagram));
      localStorage.setItem(localStorageLatest, diagram.id);
      let localDiagrams: LocalStorageDiagramListItem[] = JSON.parse(localStorage.getItem(localStorageDiagramsList)!);
      localDiagrams = localDiagrams ? localDiagrams.filter((entry) => entry.id !== diagram.id) : [];
      const localDiagramEntry: LocalStorageDiagramListItem = {
        id: diagram.id,
        title: diagram.title,
        type: diagram.model!.type,
        lastUpdate: moment(),
      };
      localDiagrams.push(localDiagramEntry);
      localStorage.setItem(localStorageDiagramsList, JSON.stringify(localDiagrams));
      return { type: StopActionType.STOP_ACTION };
    }),
  );
};

export const loadDiagramEpic: Epic<Action, ImportJSONAction | StopAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.LOAD),
    map((action) => action as LoadAction),
    map((action: LoadAction) => {
      let { id } = action.payload;
      const localStorageContent: string | null = window.localStorage.getItem(localStorageDiagramPrefix + id);
      if (localStorageContent) {
        return {
          type: ImportActionTypes.IMPORT_JSON,
          payload: {
            json: localStorageContent,
          },
        };
      } else {
        // TODO: Loading error
        return {
          type: StopActionType.STOP_ACTION,
        };
      }
    }),
  );
};

export const createDiagramEpic: Epic<Action, UpdateDiagramAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.CREATE_DIAGRAM),
    map((action) => action as CreateDiagramAction),
    map((action: CreateDiagramAction) => {
      let { diagramTitle, diagramType } = action.payload;
      const diagram: Diagram = {
        id: uuid(),
        title: diagramTitle,
        model: undefined,
        lastUpdate: moment(),
      };
      return DiagramRepository.updateDiagram(diagram, diagramType);
    }),
  );
};

export const localStorageEpics = combineEpics(storeEpic, loadDiagramEpic, createDiagramEpic);

import {
  CreateDiagramAction,
  Diagram,
  LoadAction,
  LocalStorageActionTypes,
  LocalStorageDiagramListItem,
  StoreAction,
} from './local-storage-types';
import { ApplicationState } from '../../components/store/application-state';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { Action } from 'redux';
import { filter, map } from 'rxjs/operators';
import { localStorageDiagramPrefix, localStorageDiagramsList, localStorageLatest } from '../../constant';
import { StopAction, StopActionType } from '../actions';
import moment from 'moment';
import { uuid } from '../../utils/uuid';
import { UpdateDiagramAction } from '../diagram/diagram-types';
import { DiagramRepository } from '../diagram/diagram-repository';
import { ErrorActionType, LoadDiagramErrorAction } from '../error-management/error-types';
import { ErrorRepository } from '../error-management/error-repository';

export const storeEpic: Epic<Action, StopAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.STORE),
    map((action) => action as StoreAction),
    map((action: StoreAction) => {
      const { diagram } = action.payload;
      // save diagram and update latest diagram entry
      localStorage.setItem(localStorageDiagramPrefix + diagram.id, JSON.stringify(diagram));
      localStorage.setItem(localStorageLatest, diagram.id);

      // new entry for local storage list
      const type = diagram.model?.type ? diagram.model.type : store.value.editorOptions.type;
      const localDiagramEntry: LocalStorageDiagramListItem = {
        id: diagram.id,
        title: diagram.title,
        type,
        lastUpdate: moment(),
      };

      // list with diagrams in local storage
      const localStorageListJson = localStorage.getItem(localStorageDiagramsList);
      let localDiagrams: LocalStorageDiagramListItem[];
      if (localStorageListJson) {
        localDiagrams = JSON.parse(localStorageListJson);
        // filter old value
        localDiagrams = localDiagrams.filter((entry) => entry.id !== diagram.id);
      } else {
        localDiagrams = [];
      }
      // add new value and save
      localDiagrams.push(localDiagramEntry);
      localStorage.setItem(localStorageDiagramsList, JSON.stringify(localDiagrams));
      return { type: StopActionType.STOP_ACTION };
    }),
  );
};

export const loadDiagramEpic: Epic<Action, UpdateDiagramAction | LoadDiagramErrorAction, ApplicationState> = (
  action$,
  store,
) => {
  return action$.pipe(
    ofType(LocalStorageActionTypes.LOAD),
    map((action) => action as LoadAction),
    map((action: LoadAction) => {
      const { id } = action.payload;
      const localStorageContent: string | null = window.localStorage.getItem(localStorageDiagramPrefix + id);
      if (localStorageContent) {
        const diagram: Diagram = JSON.parse(localStorageContent);
        return DiagramRepository.updateDiagram(diagram, diagram.model?.type);
      } else {
        return ErrorRepository.createError(
          ErrorActionType.ERROR_LOAD_DIAGRAM,
          'Could not load diagram',
          `The key for diagram with id ${id} could not be found. Maybe you deleted it from your local storage?`,
        ) as LoadDiagramErrorAction;
      }
    }),
  );
};

export const createDiagramEpic: Epic<Action, UpdateDiagramAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.CREATE_DIAGRAM),
    map((action) => action as CreateDiagramAction),
    map((action: CreateDiagramAction) => {
      const { diagramTitle, diagramType } = action.payload;
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

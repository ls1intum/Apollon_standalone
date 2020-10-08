import { LoadAction, LocalStorageActionTypes, LocalStorageDiagramListItem, StoreAction } from './local-storage-types';
import { ApplicationState } from '../../components/store/application-state';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { Action } from 'redux';
import { filter, map, mergeMap } from 'rxjs/operators';
import { localStorageDiagramPrefix, localStorageDiagramsList, localStorageLatest } from '../../constant';
import { StopAction, StopActionType } from '../actions';
import moment from 'moment';
import { Diagram, UpdateDiagramAction } from '../diagram/diagram-types';
import { DiagramRepository } from '../diagram/diagram-repository';
import { ErrorActionType, LoadDiagramErrorAction } from '../error-management/error-types';
import { ErrorRepository } from '../error-management/error-repository';
import { of } from 'rxjs';
import { EditorOptionsRepository } from '../editor-options/editor-options-repository';
import { ChangeDiagramTypeAction } from '../editor-options/editor-options-types';

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

export const loadDiagramEpic: Epic<
  Action,
  UpdateDiagramAction | ChangeDiagramTypeAction | LoadDiagramErrorAction,
  ApplicationState
> = (action$, store) => {
  return action$.pipe(
    ofType(LocalStorageActionTypes.LOAD),
    map((action) => action as LoadAction),
    mergeMap((action: LoadAction) => {
      const { id } = action.payload;
      const localStorageContent: string | null = window.localStorage.getItem(localStorageDiagramPrefix + id);
      if (localStorageContent) {
        const diagram: Diagram = JSON.parse(localStorageContent);
        if (diagram.model?.type) {
          return of(
            DiagramRepository.updateDiagram({ ...diagram }),
            EditorOptionsRepository.changeDiagramType(diagram.model?.type),
          );
        }
        return of(DiagramRepository.updateDiagram({ ...diagram }));
      } else {
        return of(
          ErrorRepository.createError(
            ErrorActionType.ERROR_LOAD_DIAGRAM,
            'Could not load diagram',
            `The key for diagram with id ${id} could not be found. Maybe you deleted it from your local storage?`,
          ) as LoadDiagramErrorAction,
        );
      }
    }),
  );
};

export const localStorageEpics = combineEpics(storeEpic, loadDiagramEpic);

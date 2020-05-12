import {
  CreateDiagramAction,
  LoadAction,
  LocalStorageActionTypes,
  LocalStorageDiagramListItem,
  StoreAction,
} from './local-storage-types';
import { ApplicationState } from '../../components/store/application-state';
import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { filter, map, tap } from 'rxjs/operators';
import { localStorageDiagramPrefix, localStorageDiagramsList, localStorageLatest } from '../../constant';
import { StopAction, StopActionType } from '../actions';
import { ChangeDiagramTypeAction, EditorOptionsActionTypes } from '../editor-options/editor-options-types';
import { UMLDiagramType } from '@ls1intum/apollon';
import moment from 'moment';

export const storeEpic: Epic<Action, StopAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.STORE),
    map((action) => action as StoreAction),
    map((action: StoreAction) => {
      let { id, title, model } = action.payload;
      let localSaved = {
        id,
        title,
        model,
      };
      localStorage.setItem(localStorageDiagramPrefix + localSaved.id, JSON.stringify(localSaved));
      localStorage.setItem(localStorageLatest, id);
      let localDiagrams: LocalStorageDiagramListItem[] = JSON.parse(localStorage.getItem(localStorageDiagramsList)!);
      localDiagrams = localDiagrams ? localDiagrams : [];
      const localDiagramEntry: LocalStorageDiagramListItem = {
        id: id,
        title: title,
        type: model.type,
        lastUpdate: moment(),
      };
      localDiagrams.push(localDiagramEntry);
      localStorage.setItem(localStorageDiagramsList, JSON.stringify(localDiagrams));
      // return stop_action -> action without effect
      return {
        type: StopActionType.STOP_ACTION,
      };
    }),
  );
};

/**
 * side effect after Reducer for CREATE_DIAGRAM action has received message -> change diagram type of editor to new diagram
 * @param action$
 * @param store
 */
export const createDiagramEpic: Epic<Action, ChangeDiagramTypeAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.CREATE_DIAGRAM),
    map((action) => action as CreateDiagramAction),
    map((action: CreateDiagramAction) => {
      let { diagramTitle, diagramType } = action.payload;
      return {
        type: EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE,
        payload: {
          type: diagramType,
        },
      };
    }),
  );
};

/**
 * side effect after Reducer for LOAD_Diagram action has received message -> change diagram type of editor to new diagram
 * @param action$
 * @param store
 */
export const loadDiagramEpic: Epic<Action, ChangeDiagramTypeAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.LOAD),
    map((action) => action as LoadAction),
    map((action: LoadAction) => {
      const editorType = store.value.diagram?.model?.type as UMLDiagramType;
      return {
        type: EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE,
        payload: {
          type: editorType,
        },
      };
    }),
  );
};

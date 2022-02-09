import { combineEpics, Epic } from 'redux-observable';
import { Action } from 'redux';
import { ChangeDiagramTypeAction } from '../editor-options/editor-options-types.js';
import { ApplicationState } from '../../components/store/application-state.js';
import { filter, map, mergeMap } from 'rxjs/operators';
import { CreateDiagramAction, Diagram, DiagramActionTypes, UpdateDiagramAction } from './diagram-types.js';
import { uuid } from '../../utils/uuid.js';
import moment from 'moment';
import { DiagramRepository } from './diagram-repository.js';
import { StoreAction } from '../local-storage/local-storage-types.js';
import { LocalStorageRepository } from '../local-storage/local-storage-repository.js';
import { of } from 'rxjs';
import { EditorOptionsRepository } from '../editor-options/editor-options-repository.js';

export const createDiagramEpic: Epic<Action, UpdateDiagramAction | ChangeDiagramTypeAction, ApplicationState> = (
  action$,
  store,
) => {
  return action$.pipe(
    filter((action) => action.type === DiagramActionTypes.CREATE_DIAGRAM),
    map((action) => action as CreateDiagramAction),
    mergeMap((action: CreateDiagramAction) => {
      const { diagramTitle, diagramType, template } = action.payload;
      const diagram: Diagram = {
        id: uuid(),
        title: diagramTitle,
        model: template,
        lastUpdate: moment(),
      };
      return of(DiagramRepository.updateDiagram(diagram), EditorOptionsRepository.changeDiagramType(diagramType));
    }),
  );
};

/**
 * side effect after Reducer for CREATE_DIAGRAM action has received message -> change diagram type of editor to new diagram
 * @param action$
 * @param store
 */
export const updateDiagramEpic: Epic<
  Action,
  StoreAction | UpdateDiagramAction | ChangeDiagramTypeAction,
  ApplicationState
> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === DiagramActionTypes.UPDATE_DIAGRAM),
    map((action) => action as UpdateDiagramAction),
    map((action: UpdateDiagramAction) => {
      if (!store.value.diagram) {
        throw Error('Updated diagram is not undefined or null');
      }
      return LocalStorageRepository.store(store.value.diagram);
    }),
  );
};

// TODO: Fix the types when library fixes it
export const diagramEpics = combineEpics(createDiagramEpic, updateDiagramEpic) as any;

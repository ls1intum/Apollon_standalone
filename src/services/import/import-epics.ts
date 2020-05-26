import { Action } from 'redux';
import { Diagram, StoreAction } from '../local-storage/local-storage-types';
import { ImportActionTypes, ImportJSONAction } from './import-types';
import { Epic } from 'redux-observable';
import { ApplicationState } from '../../components/store/application-state';
import { filter, map, mergeMap } from 'rxjs/operators';
import { UpdateDiagramAction } from '../diagram/diagram-types';
import { DiagramRepository } from '../diagram/diagram-repository';
import { uuid } from '../../utils/uuid';
import { of } from 'rxjs';
import { LocalStorageRepository } from '../local-storage/local-storage-repository';

export const importEpic: Epic<Action, UpdateDiagramAction | StoreAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === ImportActionTypes.IMPORT_JSON),
    map((action) => action as ImportJSONAction),
    map((action: ImportJSONAction) => {
      const { json } = action.payload;
      const diagram: Diagram = JSON.parse(json);
      diagram.id = uuid();
      return diagram;
    }),
    mergeMap((diagram: Diagram, index: number) => {
      return of(DiagramRepository.updateDiagram(diagram, diagram.model?.type), LocalStorageRepository.store(diagram));
    }),
  );
};

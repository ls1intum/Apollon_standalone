import { Action } from 'redux';
import { Diagram, StoreAction } from '../local-storage/local-storage-types';
import { ImportActionTypes, ImportJSONAction } from './import-types';
import { Epic, ofType } from 'redux-observable';
import { ApplicationState } from '../../components/store/application-state';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { UpdateDiagramAction } from '../diagram/diagram-types';
import { DiagramRepository } from '../diagram/diagram-repository';
import { uuid } from '../../utils/uuid';
import { of } from 'rxjs';
import { LocalStorageRepository } from '../local-storage/local-storage-repository';
import { ErrorRepository } from '../error-management/error-repository';
import { ErrorActionType, ImportDiagramErrorAction } from '../error-management/error-types';

export const importEpic: Epic<
  Action,
  UpdateDiagramAction | StoreAction | ImportDiagramErrorAction,
  ApplicationState
> = (action$, store) => {
  return action$.pipe(
    ofType(ImportActionTypes.IMPORT_JSON),
    map((action) => action as ImportJSONAction),
    mergeMap((action: ImportJSONAction) => {
      return of(action).pipe(
        mergeMap((action: ImportJSONAction) => {
          const { json } = action.payload;
          const diagram: Diagram = JSON.parse(json);
          diagram.id = uuid();
          return of(
            DiagramRepository.updateDiagram(diagram, diagram.model?.type),
            LocalStorageRepository.store(diagram),
          );
        }),
        catchError((error) =>
          of(
            ErrorRepository.createError(
              ErrorActionType.ERROR_IMPORT_DIAGRAM,
              'Import failed',
              'Could not import selected file. Are you sure it contains a diagram.json?',
            ) as ImportDiagramErrorAction,
          ),
        ),
      );
    }),
  );
};

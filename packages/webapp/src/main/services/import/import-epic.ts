import { Action } from 'redux';
import { Epic, ofType } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ApplicationState } from '../../components/store/application-state';
import { uuid } from '../../utils/uuid';
import { StopAction } from '../actions';
import { DiagramRepository } from '../diagram/diagram-repository';
import { Diagram, UpdateDiagramAction } from '../diagram/diagram-types';
import { EditorOptionsRepository } from '../editor-options/editor-options-repository';
import { ChangeDiagramTypeAction } from '../editor-options/editor-options-types';
import { ErrorRepository } from '../error-management/error-repository';
import { DisplayErrorAction, ErrorActionType } from '../error-management/error-types';
import { ImportActionTypes, ImportJSONAction } from './import-types';

export const importEpic: Epic<
  Action,
  UpdateDiagramAction | ChangeDiagramTypeAction | DisplayErrorAction | StopAction,
  ApplicationState
> = (action$: Observable<Action<ImportActionTypes>>) => {
  return action$.pipe(
    ofType(ImportActionTypes.IMPORT_JSON),
    map((action) => action as ImportJSONAction),
    mergeMap((action: ImportJSONAction) => {
      return of(action).pipe(
        mergeMap((importAction: ImportJSONAction) => {
          const { json } = importAction.payload;
          const diagram: Diagram = JSON.parse(json);
          diagram.id = uuid();
          return of(
            DiagramRepository.updateDiagram({ ...diagram, ...{ diagramType: diagram.model?.type } }),
            EditorOptionsRepository.changeDiagramType(diagram.model!.type),
          );
        }),
        catchError((error) =>
          of(
            ErrorRepository.createError(
              ErrorActionType.DISPLAY_ERROR,
              'Import failed',
              'Could not import selected file. Are you sure it contains a diagram.json?',
            ) as DisplayErrorAction,
          ),
        ),
      );
    }),
  );
};

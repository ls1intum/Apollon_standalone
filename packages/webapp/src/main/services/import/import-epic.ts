import { Action } from 'redux';
import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ApplicationState } from '../../components/store/application-state.js';
import { uuid } from '../../utils/uuid.js';
import { StopAction } from '../actions.js';
import { DiagramRepository } from '../diagram/diagram-repository.js';
import { Diagram, UpdateDiagramAction } from '../diagram/diagram-types.js';
import { EditorOptionsRepository } from '../editor-options/editor-options-repository.js';
import { ChangeDiagramTypeAction } from '../editor-options/editor-options-types.js';
import { ErrorRepository } from '../error-management/error-repository.js';
import { DisplayErrorAction, ErrorActionType } from '../error-management/error-types.js';
import { ImportActionTypes, ImportJSONAction } from './import-types.js';

export const importEpic: Epic<
  Action,
  UpdateDiagramAction | ChangeDiagramTypeAction | DisplayErrorAction | StopAction,
  ApplicationState
> = (action$, store) => {
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

import { Action } from 'redux';
import { ImportActionTypes, ImportJSONAction } from './import-types';
import { Epic, ofType } from 'redux-observable';
import { ApplicationState } from '../../components/store/application-state';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Diagram, UpdateDiagramAction } from '../diagram/diagram-types';
import { DiagramRepository } from '../diagram/diagram-repository';
import { uuid } from '../../utils/uuid';
import { of } from 'rxjs';
import { ErrorRepository } from '../error-management/error-repository';
import { DisplayErrorAction, ErrorActionType } from '../error-management/error-types';
import { EditorOptionsRepository } from '../editor-options/editor-options-repository';
import { ChangeDiagramTypeAction } from '../editor-options/editor-options-types';

export const importEpic: Epic<
  Action,
  UpdateDiagramAction | ChangeDiagramTypeAction | DisplayErrorAction,
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

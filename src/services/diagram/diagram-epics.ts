import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { ChangeDiagramTypeAction, EditorOptionsActionTypes } from '../editor-options/editor-options-types';
import { ApplicationState } from '../../components/store/application-state';
import { filter, map } from 'rxjs/operators';
import { DiagramActionTypes, UpdateDiagramAction } from './diagram-types';
import { StopAction, StopActionType } from '../actions';

/**
 * side effect after Reducer for CREATE_DIAGRAM action has received message -> change diagram type of editor to new diagram
 * @param action$
 * @param store
 */
export const updateDiagramEpic: Epic<Action, ChangeDiagramTypeAction | StopAction, ApplicationState> = (
  action$,
  store,
) => {
  return action$.pipe(
    filter((action) => action.type === DiagramActionTypes.UPDATE_DIAGRAM),
    map((action) => action as UpdateDiagramAction),
    map((action: UpdateDiagramAction) => {
      const { diagramType } = action.payload;
      if (diagramType) {
        return {
          type: EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE,
          payload: {
            type: diagramType,
          },
        };
      } else {
        return {
          type: StopActionType.STOP_ACTION,
        };
      }
    }),
  );
};

import { Action } from 'redux';
import { Diagram } from '../local-storage/local-storage-types';
import { ImportActionTypes, ImportJSONAction } from './import-types';
import { Epic } from 'redux-observable';
import { ApplicationState } from '../../components/store/application-state';
import { filter, map } from 'rxjs/operators';
import { DiagramActionTypes, UpdateDiagramAction } from '../diagram/diagram-types';
import { DiagramRepository } from '../diagram/diagram-repository';

export const importEpic: Epic<Action, UpdateDiagramAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === ImportActionTypes.IMPORT_JSON),
    map((action) => action as ImportJSONAction),
    map((action: ImportJSONAction) => {
      const { json } = action.payload;
      const diagram: Diagram = JSON.parse(json);
      console.log('Parsed')
      console.log(diagram)
      return DiagramRepository.updateDiagram(diagram, diagram.model?.type);
    }),
  );
};

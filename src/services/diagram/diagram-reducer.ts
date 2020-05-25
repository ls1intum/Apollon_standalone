import { Reducer } from 'redux';
import { Diagram } from '../local-storage/local-storage-types';
import { Actions } from '../actions';
import { DiagramActionTypes, UpdateDiagramAction } from './diagram-types';

export const DiagramReducer: Reducer<Diagram | null, Actions> = (state, action) => {
  switch (action.type) {
    case DiagramActionTypes.UPDATE_DIAGRAM: {
      const { payload } = action;
      console.log(payload.diagram);
      return payload.diagram;
    }
  }

  return !state ? null : state;
};

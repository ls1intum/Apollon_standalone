import { Reducer } from 'redux';
import { Actions } from '../actions';
import { Diagram, LocalStorageActionTypes } from './local-storage-types';
import { uuid } from '../../utils/uuid';
import { localStorageDiagramPrefix } from '../../constant';
import moment from 'moment';

export const LocalStorageReducer: Reducer<Diagram | null, Actions> = (state, action) => {
  switch (action.type) {
    case LocalStorageActionTypes.LOAD: {
      const { payload } = action;

      console.log(localStorageDiagramPrefix + payload.id);
      const diagram: Diagram = JSON.parse(window.localStorage.getItem(localStorageDiagramPrefix + payload.id)!);
      console.log(diagram);
      return diagram ? diagram : null;
    }
    case LocalStorageActionTypes.CREATE_DIAGRAM: {
      return {
        id: uuid(),
        title: action.payload.diagramTitle,
        model: undefined,
        lastUpdate: moment(),
      };
    }
  }

  return !state ? null : state;
};

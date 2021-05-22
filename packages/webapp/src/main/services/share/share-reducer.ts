import { Reducer } from 'redux';
import { Actions } from '../actions';
import { ShareActionTypes, ShareState } from './share-types';

export const ShareReducer: Reducer<ShareState, Actions> = (
  state = { collaborationName: '', collaborators: [], fromServer: false },
  action,
) => {
  switch (action.type) {
    case ShareActionTypes.UPDATE_COLLABORATION_NAME: {
      const { payload } = action;
      return {
        ...state,
        collaborationName: payload.name,
      } as ShareState;
    }
    case ShareActionTypes.UPDATE_COLLABORATORS: {
      const { payload } = action;
      return {
        ...state,
        collaborators: payload.collaborators,
      } as ShareState;
    }
    case ShareActionTypes.GOT_FROM_SERVER: {
      const { payload } = action;
      return {
        ...state,
        fromServer: payload.fromServer,
      } as ShareState;
    }
  }

  return state;
};

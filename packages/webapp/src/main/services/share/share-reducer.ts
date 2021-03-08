import { Reducer } from 'redux';
import { Actions } from '../actions';
import { ShareActionTypes, ShareState } from './share-types';

export const ShareReducer: Reducer<ShareState, Actions> = (state = { count: 0, fromServer: false }, action) => {
  switch (action.type) {
    case ShareActionTypes.UPDATE_CLIENT_COUNT: {
      const { payload } = action;
      return {
        ...state,
        count: payload.count,
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

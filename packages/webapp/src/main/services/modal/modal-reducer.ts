import { Reducer } from 'redux';
import { Actions } from '../actions.js';
import { ModalActionType, ModalState } from './modal-types.js';

export const ModalReducer: Reducer<ModalState, Actions> = (state: ModalState = { type: null, size: 'sm' }, action) => {
  switch (action.type) {
    case ModalActionType.SHOW_MODAL: {
      const { payload } = action;
      return payload;
    }
    case ModalActionType.HIDE_MODAL: {
      return { type: null, size: 'sm' };
    }
  }

  return state;
};

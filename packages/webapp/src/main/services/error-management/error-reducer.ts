import { Reducer } from 'redux';
import { Actions } from '../actions';
import { ApollonError, ErrorActionType } from './error-types';

export const ErrorReducer: Reducer<ApollonError[], Actions> = (state = [], action) => {
  switch (action.type) {
    case ErrorActionType.DISPLAY_ERROR: {
      const { payload } = action;
      const errors: ApollonError[] = state ? [...state] : [];
      errors.push({ ...payload });
      return errors;
    }
    case ErrorActionType.DISMISS_ERROR: {
      const { payload } = action;
      let errors: ApollonError[] = state ? [...state] : [];
      errors = errors.filter((error) => error.id !== payload.id);
      return errors;
    }
  }

  return state;
};

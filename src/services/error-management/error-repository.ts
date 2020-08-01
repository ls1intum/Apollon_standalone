import { ErrorActionType } from './error-types';
import { uuid } from '../../utils/uuid';

export const ErrorRepository = {
  createError: (type: ErrorActionType, headerText: string, bodyText: string) => ({
    type,
    payload: {
      id: uuid(),
      headerText,
      bodyText,
    },
  }),
  dismissError: (errorId: string) => ({
    type: ErrorActionType.DISMISS_ERROR,
    payload: {
      id: errorId,
    },
  }),
};

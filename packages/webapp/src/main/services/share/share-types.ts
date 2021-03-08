import { Action } from 'redux';

export type ShareActions = UpdateClientCountAction | GotFromServerAction;

export type ShareState = { count: number; fromServer: boolean };

export const enum ShareActionTypes {
  UPDATE_CLIENT_COUNT = '@@share/update_client_count',
  GOT_FROM_SERVER = '@@share/got_from_server',
}

export type UpdateClientCountAction = Action<ShareActionTypes.UPDATE_CLIENT_COUNT> & {
  payload: {
    count: number;
  };
};

export type GotFromServerAction = Action<ShareActionTypes.GOT_FROM_SERVER> & {
  payload: {
    fromServer: boolean;
  };
};

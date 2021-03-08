import { GotFromServerAction, ShareActionTypes, UpdateClientCountAction } from './share-types';

export const ShareRepository = {
  updateClientCount: (count: number): UpdateClientCountAction => ({
    type: ShareActionTypes.UPDATE_CLIENT_COUNT,
    payload: { count },
  }),
  gotFromServer: (fromServer: boolean): GotFromServerAction => ({
    type: ShareActionTypes.GOT_FROM_SERVER,
    payload: { fromServer },
  }),
};

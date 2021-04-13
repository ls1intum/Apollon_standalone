import {
  GotFromServerAction,
  ShareActionTypes,
  UpdateCollaborationNameAction,
  UpdateCollaboratorsAction,
} from './share-types';

export const ShareRepository = {
  updateCollaborationName: (name: string): UpdateCollaborationNameAction => ({
    type: ShareActionTypes.UPDATE_COLLABORATION_NAME,
    payload: { name },
  }),
  updateCollaborators: (collaborators: string[]): UpdateCollaboratorsAction => ({
    type: ShareActionTypes.UPDATE_COLLABORATORS,
    payload: { collaborators },
  }),
  gotFromServer: (fromServer: boolean): GotFromServerAction => ({
    type: ShareActionTypes.GOT_FROM_SERVER,
    payload: { fromServer },
  }),
};

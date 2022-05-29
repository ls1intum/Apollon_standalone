import {
  GotFromServerAction,
  ShareActionTypes,
  UpdateCollaborationColorAction,
  UpdateCollaborationNameAction,
  UpdateCollaboratorsAction,
} from './share-types';
import { Collaborator } from 'shared/src/main/collaborator-dto';

export const ShareRepository = {
  updateCollaborationName: (name: string): UpdateCollaborationNameAction => ({
    type: ShareActionTypes.UPDATE_COLLABORATION_NAME,
    payload: { name },
  }),
  updateCollaborationColor: (color: string): UpdateCollaborationColorAction => ({
    type: ShareActionTypes.UPDATE_COLLABORATION_COLOR,
    payload: { color },
  }),
  updateCollaborators: (collaborators: Collaborator[]): UpdateCollaboratorsAction => ({
    type: ShareActionTypes.UPDATE_COLLABORATORS,
    payload: { collaborators },
  }),
  gotFromServer: (fromServer: boolean): GotFromServerAction => ({
    type: ShareActionTypes.GOT_FROM_SERVER,
    payload: { fromServer },
  }),
};

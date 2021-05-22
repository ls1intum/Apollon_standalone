import { Action } from 'redux';

export type ShareActions = UpdateCollaborationNameAction | UpdateCollaboratorsAction | GotFromServerAction;

export type ShareState = { collaborationName: string; collaborators: string[]; fromServer: boolean };

export const enum ShareActionTypes {
  UPDATE_COLLABORATION_NAME = '@@share/update_collaboration_name',
  UPDATE_COLLABORATORS = '@@share/update_collaborators',
  GOT_FROM_SERVER = '@@share/got_from_server',
}

export type UpdateCollaborationNameAction = Action<ShareActionTypes.UPDATE_COLLABORATION_NAME> & {
  payload: {
    name: string;
  };
};

export type UpdateCollaboratorsAction = Action<ShareActionTypes.UPDATE_COLLABORATORS> & {
  payload: {
    collaborators: string[];
  };
};

export type GotFromServerAction = Action<ShareActionTypes.GOT_FROM_SERVER> & {
  payload: {
    fromServer: boolean;
  };
};

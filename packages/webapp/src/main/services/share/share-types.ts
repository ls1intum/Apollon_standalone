import { Action } from 'redux';
import { Collaborator } from 'shared/src/main/collaborator-dto';

export type ShareActions =
  | UpdateCollaborationNameAction
  | UpdateCollaboratorsAction
  | GotFromServerAction
  | UpdateCollaborationColorAction;

export type ShareState = {
  collaborationName: string;
  collaborationColor: string;
  collaborators: Collaborator[];
  fromServer: boolean;
};

export const enum ShareActionTypes {
  UPDATE_COLLABORATION_NAME = '@@share/update_collaboration_name',
  UPDATE_COLLABORATION_COLOR = '@@share/update_collaboration_color',
  UPDATE_COLLABORATORS = '@@share/update_collaborators',
  GOT_FROM_SERVER = '@@share/got_from_server',
}

export type UpdateCollaborationNameAction = Action<ShareActionTypes.UPDATE_COLLABORATION_NAME> & {
  payload: {
    name: string;
  };
};

export type UpdateCollaborationColorAction = Action<ShareActionTypes.UPDATE_COLLABORATION_COLOR> & {
  payload: {
    color: string;
  };
};

export type UpdateCollaboratorsAction = Action<ShareActionTypes.UPDATE_COLLABORATORS> & {
  payload: {
    collaborators: Collaborator[];
  };
};

export type GotFromServerAction = Action<ShareActionTypes.GOT_FROM_SERVER> & {
  payload: {
    fromServer: boolean;
  };
};

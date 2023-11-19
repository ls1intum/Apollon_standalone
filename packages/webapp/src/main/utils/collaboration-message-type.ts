import { CollaboratorType } from 'shared/src/main/collaborator-dto';
import { SelectionChangeType } from 'shared/src/main/selection-dto';
import { Diagram } from '../services/diagram/diagram-types';
import { Patch } from '@ls1intum/apollon';


export type CollaborationMessage = {
  diagram?: Diagram;
  originator?: CollaboratorType;
  collaborators?: CollaboratorType[];
  patch?: Patch;
  selection?: SelectionChangeType;
};

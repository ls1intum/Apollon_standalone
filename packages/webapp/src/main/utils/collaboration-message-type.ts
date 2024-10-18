import { CollaboratorType } from 'shared/src/main/collaborator-dto';
import { SelectionChangeType } from 'shared/src/main/selection-dto';
import { Patch } from '@ls1intum/apollon';
import { Diagram } from '../services/diagram/diagramSlice';

export type CollaborationMessage = {
  diagram?: Diagram;
  originator?: CollaboratorType;
  collaborators?: CollaboratorType[];
  patch?: Patch;
  selection?: SelectionChangeType;
};

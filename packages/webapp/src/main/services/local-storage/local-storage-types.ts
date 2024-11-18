import { UMLDiagramType } from '@ls1intum/apollon';

export type LocalStorageDiagramListItem = {
  id: string;
  title: string;
  type: UMLDiagramType;
  lastUpdate: string;
};

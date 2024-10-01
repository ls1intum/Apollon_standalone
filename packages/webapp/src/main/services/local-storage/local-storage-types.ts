import { UMLDiagramType } from '@ls1intum/apollon';
import { Moment } from 'moment';


export type LocalStorageDiagramListItem = {
  id: string;
  title: string;
  type: UMLDiagramType;
  lastUpdate: Moment;
};



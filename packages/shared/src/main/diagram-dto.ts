import { UMLModel } from '@ls1intum/apollon';
import { Moment } from 'moment';

export class DiagramDTO {
  id: string;
  title: string;
  model: UMLModel;
  lastUpdate: Moment;
  versions?: DiagramDTO[];
  description?: string;

  constructor(id: string, title: string, model: UMLModel, lastUpdate: Moment, versions: DiagramDTO[]) {
    this.id = id;
    this.title = title;
    this.model = model;
    this.lastUpdate = lastUpdate;
    this.versions = versions;
  }
}

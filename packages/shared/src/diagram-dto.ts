import { UMLModel } from '@ls1intum/apollon';
import { Moment } from 'moment';

export class DiagramDTO {
  id: string;
  title: string;
  model: UMLModel;
  lastUpdate: Moment;

  constructor(id: string, title: string, model: UMLModel, lastUpdate: Moment) {
    this.id = id;
    this.title = title;
    this.model = model;
    this.lastUpdate = lastUpdate;
  }
}

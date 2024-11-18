import { UMLModel } from '@ls1intum/apollon';

export class DiagramDTO {
  id: string;
  title: string;
  model: UMLModel;
  lastUpdate: string;

  constructor(id: string, title: string, model: UMLModel, lastUpdate: string) {
    this.id = id;
    this.title = title;
    this.model = model;
    this.lastUpdate = lastUpdate;
  }
}

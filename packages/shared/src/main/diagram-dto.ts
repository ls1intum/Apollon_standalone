import { UMLModel } from '@ls1intum/apollon';

export class DiagramDTO {
  id: string;
  title: string;
  model: UMLModel;
  lastUpdate: string;
  versions?: DiagramDTO[];
  description?: string;

  constructor(id: string, title: string, model: UMLModel, lastUpdate: string, versions: DiagramDTO[]) {
    this.id = id;
    this.title = title;
    this.model = model;
    this.lastUpdate = lastUpdate;
    this.versions = versions;
  }
}

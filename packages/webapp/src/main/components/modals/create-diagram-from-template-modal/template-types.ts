import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { SoftwarePatternType } from './software-pattern/software-pattern-types';

export enum TemplateCategory {
  SOFTWARE_PATTERN = 'Software Pattern',
}

export type TemplateType = SoftwarePatternType;

export class Template {
  category: TemplateCategory;
  type: TemplateType;
  diagramType: UMLDiagramType;
  diagram: UMLModel;

  constructor(
    templateCategory: TemplateCategory,
    templateType: TemplateType,
    diagramType: UMLDiagramType,
    diagram: UMLModel,
  ) {
    this.category = templateCategory;
    this.type = templateType;
    this.diagramType = diagramType;
    this.diagram = diagram;
  }
}

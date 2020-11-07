import { Template, TemplateCategory, TemplateType } from '../template-types';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';

export enum SoftwarePatternCategory {
  CREATIONAL = 'Creational',
  STRUCTURAL = 'Structural',
  BEHAVIORAL = 'Behavioral',
}

export enum SoftwarePatternType {
  // Structural patterns
  ADAPTER = 'Adapter',
  BRIDGE = 'Bridge',
  // Behavioral pattern
  COMMAND = 'Command',
  OBSERVER = 'Observer',
  // Creational patterns
  FACTORY = 'Factory',
}

export class SoftwarePatternTemplate extends Template {
  softwarePatternCategory: SoftwarePatternCategory;

  constructor(
    templateCategory: TemplateCategory,
    templateType: TemplateType,
    diagramType: UMLDiagramType,
    diagram: UMLModel,
    patternCategory: SoftwarePatternCategory,
  ) {
    super(templateCategory, templateType, diagramType, diagram);
    this.softwarePatternCategory = patternCategory;
  }
}

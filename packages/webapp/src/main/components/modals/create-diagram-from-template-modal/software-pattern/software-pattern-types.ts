import { Template, TemplateCategory, TemplateType } from '../template-types.js';
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

  /**
   * Should only be called from TemplateFactory. Do not call this method!
   * @param templateCategory
   * @param templateType
   * @param diagramType
   * @param diagram
   * @param patternCategory
   */
  constructor(
    templateType: TemplateType,
    diagramType: UMLDiagramType,
    diagram: UMLModel,
    patternCategory: SoftwarePatternCategory,
  ) {
    super(templateType, diagramType, diagram);
    this.softwarePatternCategory = patternCategory;
  }
}

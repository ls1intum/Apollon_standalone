import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import {
  SoftwarePatternCategory,
  SoftwarePatternTemplate,
  SoftwarePatternType,
} from './software-pattern/software-pattern-types';

import observerModel from '../../../templates/pattern/behavioral/observer.json';
import commandModel from '../../../templates/pattern/behavioral/command.json';
import adapterModel from '../../../templates/pattern/structural/adapter.json';
import bridgeModel from '../../../templates/pattern/structural/bridge.json';
import factoryModel from '../../../templates/pattern/creational/factory.json';

export enum TemplateCategory {
  SOFTWARE_PATTERN = 'Software Pattern',
}

export type TemplateType = SoftwarePatternType;

export class Template {
  category: TemplateCategory;
  type: TemplateType;
  diagramType: UMLDiagramType;
  diagram: UMLModel;

  protected constructor(
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

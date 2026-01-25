import {
  SoftwarePatternCategory,
  SoftwarePatternTemplate,
  SoftwarePatternType,
} from './software-pattern/software-pattern-types';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import adapterModel from '../../../templates/pattern/structural/adapter.json';
import bridgeModel from '../../../templates/pattern/structural/bridge.json';
import commandModel from '../../../templates/pattern/behavioral/command.json';
import factoryModel from '../../../templates/pattern/creational/factory.json';
import observerModel from '../../../templates/pattern/behavioral/observer.json';

// Could also be a static method on Template, which would be nicer.
// However, because of circular dependency we decided to create a separate factory instead
export class TemplateFactory {
  static createSoftwarePattern(softwarePatternType: SoftwarePatternType): SoftwarePatternTemplate {
    switch (softwarePatternType) {
      case SoftwarePatternType.ADAPTER:
        return new SoftwarePatternTemplate(
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          adapterModel as unknown as UMLModel,
          SoftwarePatternCategory.STRUCTURAL,
        );
      case SoftwarePatternType.BRIDGE:
        return new SoftwarePatternTemplate(
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          bridgeModel as unknown as UMLModel,
          SoftwarePatternCategory.STRUCTURAL,
        );
      case SoftwarePatternType.COMMAND:
        return new SoftwarePatternTemplate(
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          commandModel as unknown as UMLModel,
          SoftwarePatternCategory.BEHAVIORAL,
        );
      case SoftwarePatternType.FACTORY:
        return new SoftwarePatternTemplate(
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          factoryModel as unknown as UMLModel,
          SoftwarePatternCategory.CREATIONAL,
        );
      case SoftwarePatternType.OBSERVER:
        return new SoftwarePatternTemplate(
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          observerModel as unknown as UMLModel,
          SoftwarePatternCategory.BEHAVIORAL,
        );
      default:
        throw Error(`Cannot create SoftwarePatternTemplate for type ${softwarePatternType}`);
    }
  }
}

import { TemplateFactory } from '../template-factory';
import { TemplateCategory, TemplateType } from '../template-types';
import { UMLDiagramType } from '@ls1intum/apollon';
import observerModel from '../../../../templates/pattern/behavioral/observer.json';
import commandModel from '../../../../templates/pattern/behavioral/command.json';
import adapterModel from '../../../../templates/pattern/structural/adapter.json';
import bridgeModel from '../../../../templates/pattern/structural/bridge.json';
import factoryModel from '../../../../templates/pattern/creational/factory.json';
import { SoftwarePatternCategory, SoftwarePatternTemplate, SoftwarePatternType } from './software-pattern-types';

export class SoftwarePatternFactory implements TemplateFactory {
  getTemplate(softwarePatternType: TemplateType): SoftwarePatternTemplate {
    switch (softwarePatternType) {
      case SoftwarePatternType.ADAPTER:
        return new SoftwarePatternTemplate(
          TemplateCategory.SOFTWARE_PATTERN,
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          adapterModel as any,
          SoftwarePatternCategory.STRUCTURAL,
        );
      case SoftwarePatternType.BRIDGE:
        return new SoftwarePatternTemplate(
          TemplateCategory.SOFTWARE_PATTERN,
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          bridgeModel as any,
          SoftwarePatternCategory.STRUCTURAL,
        );
      case SoftwarePatternType.COMMAND:
        return new SoftwarePatternTemplate(
          TemplateCategory.SOFTWARE_PATTERN,
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          commandModel as any,
          SoftwarePatternCategory.BEHAVIORAL,
        );
      case SoftwarePatternType.FACTORY:
        return new SoftwarePatternTemplate(
          TemplateCategory.SOFTWARE_PATTERN,
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          factoryModel as any,
          SoftwarePatternCategory.CREATIONAL,
        );
      case SoftwarePatternType.OBSERVER:
        return new SoftwarePatternTemplate(
          TemplateCategory.SOFTWARE_PATTERN,
          softwarePatternType,
          UMLDiagramType.ClassDiagram,
          observerModel as any,
          SoftwarePatternCategory.BEHAVIORAL,
        );
      default:
        throw Error(`Cannot create SoftwarePatternTemplate for type ${softwarePatternType}`);
    }
  }
}

import { UMLModel } from '@ls1intum/apollon';
import observerModel from '../../../pattern/behavioral/observer.json';
import commandModel from '../../../pattern/behavioral/command.json';
import adapterModel from '../../../pattern/structural/adapter.json';
import bridgeModel from '../../../pattern/structural/bridge.json';

export enum PatternCategory {
  CREATIONAL = 'Creational',
  STRUCTURAL = 'Structural',
  BEHAVIORAL = 'Behavioral',
}

export enum Pattern {
  // Structural patterns
  ADAPTER = 'Adapter',
  BRIDGE = 'Bridge',
  // Behavioral pattern
  COMMAND = 'Command',
  OBSERVER = 'Observer',
  // Creational patterns
  FACTORY = 'Factory',
  BUILDER = 'Builder',
}

export const PatternToCategoryMapping: {
  [key in Pattern]: PatternCategory;
} = {
  [Pattern.ADAPTER]: PatternCategory.STRUCTURAL,
  [Pattern.BRIDGE]: PatternCategory.STRUCTURAL,
  [Pattern.COMMAND]: PatternCategory.BEHAVIORAL,
  [Pattern.OBSERVER]: PatternCategory.BEHAVIORAL,
  [Pattern.FACTORY]: PatternCategory.CREATIONAL,
  [Pattern.BUILDER]: PatternCategory.CREATIONAL,
};

export const PatternToModelMapping: {
  [key in Pattern]: UMLModel;
} = {
  [Pattern.ADAPTER]: adapterModel as any,
  [Pattern.BRIDGE]: bridgeModel as any,
  [Pattern.COMMAND]: commandModel as any,
  [Pattern.OBSERVER]: observerModel as any,
  [Pattern.FACTORY]: observerModel as any,
  [Pattern.BUILDER]: observerModel as any,
};

export function getPatternsForCategory(category: PatternCategory): Pattern[] {
  return Object.keys(PatternToCategoryMapping).filter(
    (pattern) => PatternToCategoryMapping[pattern as Pattern] === category,
  ) as Pattern[];
}

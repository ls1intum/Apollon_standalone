import { CreateDiagramAction, Diagram, DiagramActionTypes, UpdateDiagramAction } from './diagram-types';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';

export const DiagramRepository = {
  createDiagram: (diagramTitle: string, diagramType: UMLDiagramType, template?: UMLModel): CreateDiagramAction => ({
    type: DiagramActionTypes.CREATE_DIAGRAM,
    payload: {
      diagramType,
      diagramTitle,
      template,
    },
  }),
  updateDiagram: (values: Partial<Diagram & { diagramType: UMLDiagramType }>): UpdateDiagramAction => ({
    type: DiagramActionTypes.UPDATE_DIAGRAM,
    payload: {
      values,
    },
  }),
};

import { CreateDiagramAction, Diagram, DiagramActionTypes, UpdateDiagramAction } from './diagram-types';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { BASE_URL } from '../../constant';

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
  getDiagramFromServer(url: string): Promise<Diagram> {
    const link = url.substring(url.indexOf(BASE_URL) - 1 + BASE_URL.length - 1);
    const resourceUrl = `${BASE_URL}/diagrams/${link}`;
    return fetch(resourceUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());
  },
};

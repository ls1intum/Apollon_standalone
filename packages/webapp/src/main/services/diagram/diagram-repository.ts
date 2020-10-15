import { CreateDiagramAction, Diagram, DiagramActionTypes, UpdateDiagramAction } from './diagram-types';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { BASE_URL } from '../../constant';
import { DiagramDTO } from 'shared/src/main/diagram-dto';

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
  getDiagramFromServerByToken(token: string): Promise<DiagramDTO | null> {
    const resourceUrl = `${BASE_URL}/diagrams/${token}`;
    return fetch(resourceUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        // error occured or no diagram found
        return null;
      }
    });
  },
  publishDiagramOnServer(diagram: Diagram): Promise<string> {
    const resourceUrl = `${BASE_URL}/diagrams/publish`;
    const body = JSON.stringify(diagram);
    return fetch(resourceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).then((response: Response) => {
      if (response.ok) {
        return response.text();
      } else {
        // error occured or no diagram found
        throw Error('Publish of diagram failed');
      }
    });
  },
};

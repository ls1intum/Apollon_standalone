import { CreateDiagramAction, Diagram, DiagramActionTypes, UpdateDiagramAction } from './diagram-types';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { BASE_URL } from '../../constant';
import { TokenDTO } from '../../../../../shared/token-dto';
import { DiagramDTO } from '../../../../../shared/diagram-dto';

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
  getDiagramFromServerByLink(url: string): Promise<DiagramDTO | null> {
    const token = url.substring(url.indexOf(BASE_URL) - 1 + BASE_URL.length - 1);
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
  publishDiagramOnServer(diagram: Diagram): Promise<TokenDTO[]> {
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
        return response.json();
      } else {
        // error occured or no diagram found
        throw Error('Publish of diagram failed');
      }
    });
  },
  updateDiagramOnServer(diagram: Diagram): Promise<void> {
    const resourceUrl = `${BASE_URL}/diagrams/${diagram.id}`;
    const body = JSON.stringify(diagram);
    return fetch(resourceUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).then((response) => {
      if (response.ok) {
        return;
      } else {
        // error occured or no diagram found
        throw Error('Update of diagram on server failed');
      }
    });
  },
};

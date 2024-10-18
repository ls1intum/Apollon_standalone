import { BASE_URL } from '../../constant';
import { DiagramDTO } from 'shared/src/main/diagram-dto';
import { Diagram } from './diagramSlice';

export const DiagramRepository = {
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
  convertSvgToPdf(svg: string, width: number, height: number): Promise<Blob | undefined> {
    const resourceUrl = `${BASE_URL}/diagrams/pdf`;
    const body = JSON.stringify({ svg, width, height });
    return fetch(resourceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).then((response) => {
      if (response.ok) {
        return response.blob();
      } else {
        // error occured or no diagram found
        return undefined;
      }
    });
  },
};

import { Diagram } from '../diagram/diagram-types';
import { DiagramAccess } from '../../../../../shared/diagram-access';
import { BASE_URL } from '../../constant';

const resourceUrl = `${BASE_URL}/links`;

export const LinkRepository = {
  generateLink: (diagram: Diagram, permission: DiagramAccess): Promise<{ link: string }> => {
    const body = JSON.stringify({ diagram: diagram, permission: permission });
    return fetch(resourceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    }).then((response) => response.json());
  },
};

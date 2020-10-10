import { Diagram } from '../diagram/diagram-types';
import { DiagramAccess } from '../../../../../shared/diagram-access';
import { DEPLOYMENT_URL } from '../../constant';

const resourceUrl = `${DEPLOYMENT_URL}/link`;

export const LinkRepository = {
  generateLink: (diagram: Diagram, permission: DiagramAccess): Promise<{ link: string }> => {
    const body = JSON.stringify({ diagram: diagram, permission: permission });
    return fetch(resourceUrl, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());
  },
};

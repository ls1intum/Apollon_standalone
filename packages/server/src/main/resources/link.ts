import { DiagramAccess } from '../../../../shared/diagram-access';
import { createHash } from 'crypto';
import { Diagram } from 'webapp/src/main/services/diagram/diagram-types';

type LinkData = {
  diagram: Diagram;
  permission: DiagramAccess;
};

const serverSecret = '301e44f939178f35d1bf578d1f6b70e4';

export function createLink(req: any, res: any) {
  console.log(req.body);
  const data: LinkData = req.body;
  const diagramId = data.diagram.id;
  const hash = createHash('md5')
    .update(diagramId + serverSecret + data.permission)
    .digest('hex');
  const url = `http://localhost:3333/${diagramId}-${hash}-${data.permission}`;
  res.json({ link: url });
}

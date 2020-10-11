import { DiagramAccess } from '../../../../shared/diagram-access';
import { Diagram } from 'webapp/src/main/services/diagram/diagram-types';
import { LinkService } from '../services/link-service';

type LinkCreationData = {
  diagram: Diagram;
  permission: DiagramAccess;
};

const linkService = new LinkService();
const deploymentUrl = 'http://localhost:3333';

export function createLink(req: any, res: any) {
  const data: LinkCreationData = req.body;
  const diagramId: string = data.diagram.id;
  const permission: DiagramAccess = data.permission;
  const link = linkService.createLink(diagramId, permission);
  const url = `${deploymentUrl}/${link}`;
  res.json({ link: url });
}

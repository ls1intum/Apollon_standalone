import { LinkService } from '../services/link-service';
import { Diagram } from 'webapp/src/main/services/diagram/diagram-types';
import { DiagramAccess } from '../../../../shared/diagram-access';
import { DiagramService } from '../services/diagram-service';

type UpdateDiagramData = {
  diagram: Diagram;
  permission: DiagramAccess;
};

const linkService = new LinkService();
const diagramService = new DiagramService();

export const getDiagram = (req: any, res: any) => {
  const link = req.params.link;
  if (!linkService.isLinkValid(link)) {
    res.send(401);
    return;
  }
  const diagramId = linkService.getDiagramIdFromLink(link);
  diagramService
    .getDiagram(diagramId)
    .then((diagram: Diagram) => res.json(diagram))
    .catch(() => res.status(404).send('Not found'));
};

export const updateDiagram = (req: any, res: any) => {
  const data: UpdateDiagramData = req.body;
  const link = req.params.link;
  if (!linkService.isLinkValid(link)) {
    res.status(401).send('Invalid Link');
    return;
  }
  diagramService.updateOrCreateDiagram(data.diagram, data.permission).then(() => {
    res.ok();
  });
};

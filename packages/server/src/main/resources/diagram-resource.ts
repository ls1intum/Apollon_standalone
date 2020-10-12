import { TokenService } from '../services/token-service';
import { DiagramService } from '../services/diagram-service';
import { Token } from '../entity/token';
import { DiagramDTO } from '../../../../shared/diagram-dto';
import { Diagram } from '../entity/diagram';
import { TokenDTO } from '../../../../shared/token-dto';

export class DiagramResource {
  tokenService = new TokenService();
  diagramService = new DiagramService();

  getDiagram = (req: any, res: any) => {
    const tokenValue = req.params.token;
    this.diagramService
      .getDiagramByToken(tokenValue)
      .then((diagram: Diagram | undefined) => {
        if (diagram) {
          res.json(diagram.diagram);
        } else {
          res.status(404).send('Diagram not found');
        }
      })
      .catch(() => res.status(503).send('Error occurred'));
  };

  publishDiagram = (req: any, res: any) => {
    const diagram: DiagramDTO = req.body;
    this.diagramService.publishDiagram(diagram).then((tokens: Token[]) => {
      const tokensForDiagram: TokenDTO[] = tokens.map((token) => new TokenDTO(token.permission, token.value));
      res.status(200).send(tokensForDiagram);
    });
  };

  updateDiagram = async (req: any, res: any) => {
    const diagramDTO: DiagramDTO = req.body;
    const token: Token = await this.tokenService.getTokenByValue(req.params.token);
    this.diagramService
      .updateDiagram(diagramDTO, token.permission)
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => res.status(503).send(error));
  };
}

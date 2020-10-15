import { DiagramService } from "../services/diagram-service";
import { TokenDTO } from "../../../../shared/src/token-dto";
import { DiagramDTO } from "../../../../shared/src/diagram-dto";

export class DiagramResource {
  diagramService = new DiagramService();

  getDiagram = (req: any, res: any) => {
    const tokenValue: string = req.params.token;

    // we want to make sure that we do not return all files requested by the user over this endpoint
    // otherwise the user can access any file on the system by calling this endpoint
    // -> tokenValue mus be alphanumeric
    if (/^[a-z0-9]+$/.test(tokenValue)) {
      this.diagramService
        .getDiagramByLink(tokenValue)
        .then((diagram: DiagramDTO | undefined) => {
          if (diagram) {
            res.json(diagram);
          } else {
            res.status(404).send("Diagram not found");
          }
        })
        .catch(() => res.status(503).send("Error occurred"));
    } else {
      res.status(503).send("Error occurred");
    }
  };

  publishDiagram = (req: any, res: any) => {
    const diagram: DiagramDTO = req.body;
    this.diagramService.saveDiagramAndGenerateTokens(diagram).then((tokens: TokenDTO[]) => {
      res.status(200).send(tokens);
    });
  };
}

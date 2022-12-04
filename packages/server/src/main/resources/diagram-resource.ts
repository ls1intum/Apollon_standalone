import { Request, Response } from 'express';
import pdfMake from 'pdfmake/build/pdfmake.min';
import { DiagramDTO } from '../../../../shared/src/main/diagram-dto';
import { DiagramService } from '../services/diagram-service/diagram-service';
import { DiagramFileStorageService } from '../services/diagram-storage/diagram-file-storage-service';
import { dejavuSans } from '../fonts/dejavuSans';

export class DiagramResource {
  diagramService: DiagramService = new DiagramService(new DiagramFileStorageService());

  getDiagram = (req: Request, res: Response) => {
    const tokenValue: string = req.params.token;

    // we want to make sure that we do not return all files requested by the user over this endpoint
    // otherwise the user can access any file on the system by calling this endpoint
    // -> tokenValue mus be alphanumeric
    if (/^[a-zA-Z0-9]+$/.test(tokenValue)) {
      this.diagramService
        .getDiagramByLink(tokenValue)
        .then((diagram: DiagramDTO | undefined) => {
          if (diagram) {
            res.json(diagram);
          } else {
            res.status(404).send('Diagram not found');
          }
        })
        .catch(() => res.status(503).send('Error occurred'));
    } else {
      res.status(503).send('Error occurred');
    }
  };

  publishDiagram = (req: Request, res: Response) => {
    const diagram: DiagramDTO = req.body;
    this.diagramService.saveDiagramAndGenerateTokens(diagram).then((token: string) => {
      res.status(200).send(token);
    });
  };

  convertSvgToPdf = (req: Request, res: Response) => {
    const width: number = req.body.width;
    const height: number = req.body.height;
    if (width === undefined || height === undefined) {
      res.status(400).send('Both width and height must be defined');
    } else {
      pdfMake.vfs = dejavuSans;
      pdfMake.fonts = {
        DejaVuSans: {
          normal: 'DejaVuSans.ttf',
          bold: 'DejaVuSans.ttf',
          italics: 'DejaVuSans.ttf',
          bolditalics: 'DejaVuSans.ttf'
        },
      }
      const svg = req.body.svg;
      var doc = pdfMake.createPdf({
        content: [
          {
            svg,
          },
        ],
        pageSize: { width, height },
        pageMargins: 0,
        defaultStyle: {
          font: 'DejaVuSans'
        }
      });
      const document = doc.getStream();

      document.pipe(res);
      document.end();
    }
  };
}

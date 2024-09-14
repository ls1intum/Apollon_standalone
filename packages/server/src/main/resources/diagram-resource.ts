import { Request, Response } from 'express';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake.min';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DiagramDTO } from 'shared/src/main/diagram-dto';
import { DiagramService } from '../services/diagram-service/diagram-service';
import { DiagramStorageFactory } from '../services/diagram-storage';
import { ConversionService } from '../services/conversion-service/conversion-service';

export class DiagramResource {
  diagramService: DiagramService = new DiagramService(DiagramStorageFactory.getStorageService());
  conversionService: ConversionService = new ConversionService();

  getDiagram = (req: Request, res: Response) => {
    const tokenValue: string = req.params.token;

    // we want to make sure that we do not return all files requested by the user over this endpoint
    // otherwise the user can access any file on the system by calling this endpoint
    // -> tokenValue mus be alphanumeric
    if (/^[a-zA-Z0-9]+$/.test(tokenValue)) {
      this.diagramService
        .getDiagramByLink(tokenValue)
        .then(async (diagram: DiagramDTO | undefined) => {
          if (diagram) {
            if (req.query.type === 'svg') {
              const diagramSvg = await this.conversionService.convertToSvg(diagram.model);
              res.send(diagramSvg.svg);
            } else {
              res.json(diagram);
            }
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
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      const svg = req.body.svg;
      const doc = pdfMake.createPdf({
        content: [
          {
            svg,
          },
        ],
        pageSize: { width, height },
        pageMargins: 0,
      });
      const document = doc.getStream();

      document.pipe(res);
      document.end();
    }
  };
}

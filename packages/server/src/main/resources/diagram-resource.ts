import { Request, Response } from 'express';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake.min';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DiagramDTO } from 'shared/src/main/diagram-dto';
import { DiagramService } from '../services/diagram-service/diagram-service';
import { DiagramStorageFactory } from '../services/diagram-storage';

export class DiagramResource {
  diagramService: DiagramService = new DiagramService(DiagramStorageFactory.getStorageService());

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

  publishDiagramVersion = (req: Request, res: Response) => {
    const diagram: DiagramDTO = req.body.diagram;
    const existingToken: string | undefined = req.body.token;
    this.diagramService
      .saveDiagramVersion(diagram, existingToken)
      .then((savedDiagram) => {
        res.status(200).send(savedDiagram);
      })
      .catch((error) => {
        console.error(error);
        res.status(503).send('Error occurred while publishing');
      });
  };

  deleteDiagramVersion = (req: Request, res: Response) => {
    const token: string = req.params.token;
    const versionIndex: number = req.body.versionIndex;

    this.diagramService
      .deleteDiagramVersion(token, versionIndex)
      .then((deletedDiagramVersion) => {
        res.status(200).send(deletedDiagramVersion);
      })
      .catch((error) => {
        console.error(error);
        res.status(503).send('Error occurred while deleting version');
      });
  };

  editDiagramVersion = (req: Request, res: Response) => {
    const token: string = req.params.token;
    const versionIndex: number = req.body.versionIndex;
    const title: string = req.body.title;
    const description: string = req.body.description;
    this.diagramService
      .editDiagramVersion(token, versionIndex, title, description)
      .then((editedDiagram) => {
        res.status(200).send(editedDiagram);
      })
      .catch((error) => {
        console.error(error);
        res.status(503).send('Error occurred while editing version');
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

import { Request, Response } from 'express';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake.min';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ConversionService } from '../services/conversion-service/conversion-service';
import { UMLModel } from '@ls1intum/apollon';

export class ConversionResource {
  conversionService: ConversionService = new ConversionService();

  convert = async (req: Request, res: Response) => {
    if (req.body && req.body.model) {
      let model = req.body.model;
      if (typeof model === 'string') {
        model = JSON.parse(model);
      }
      const { svg, clip } = await this.conversionService.convertToSvg(model as unknown as UMLModel);
      const { width, height } = clip;
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
      res.type('application/pdf');
      document.pipe(res);
      document.end();
    } else {
      res.status(400).send({ error: 'Model must be defined!' });
    }
  };

  status = (req: Request, res: Response) => {
    res.sendStatus(200);
  };
}

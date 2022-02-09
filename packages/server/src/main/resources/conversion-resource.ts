import { Request, Response } from 'express';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake.min.js';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { ConversionService } from '../services/conversion-service/conversion-service.js';
import { UMLModel } from '@ls1intum/apollon';

export class ConversionResource {
  conversionService: ConversionService = new ConversionService();

  convert = (req: Request, res: Response) => {
    if (req.body && req.body.model) {
      let model = req.body.model;
      if (typeof model === 'string') {
        model = JSON.parse(model);
      }
      const { svg, clip } = this.conversionService.convertToSvg(<UMLModel>(<unknown>model));
      const { width, height } = clip;
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      var doc = pdfMake.createPdf({
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

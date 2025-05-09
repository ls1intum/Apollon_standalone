import express from 'express';
import cors from 'cors';
import { DiagramResource } from './resources/diagram-resource';
import { ConversionResource } from './resources/conversion-resource';

// options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

export const register = (app: express.Application) => {
  const diagramResource = new DiagramResource();
  const router = express.Router();
  const conversionResource = new ConversionResource();
  router.use(cors(options));

  // routes: converter
  router.post('/converter/pdf', (req, res) => conversionResource.convert(req, res));
  router.get('/converter/status', (req, res) => conversionResource.status(req, res));

  // routes: diagrams
  router.post('/diagrams/pdf', (req, res) => diagramResource.convertSvgToPdf(req, res));
  router.post('/diagrams/publish', (req, res) => diagramResource.publishDiagramVersion(req, res));
  router.get('/diagrams/:token', (req, res) => diagramResource.getDiagram(req, res));
  router.delete('/diagrams/:token', (req, res) => diagramResource.deleteDiagramVersion(req, res));
  router.post('/diagrams/:token', (req, res) => diagramResource.editDiagramVersion(req, res));
  app.use('/api', router);
};

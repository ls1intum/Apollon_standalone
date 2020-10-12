import express, { Request } from 'express';
import cors from 'cors';
import { DiagramResource } from './resources/diagram-resource';
import { TokenCreationData, TokenResource } from './resources/token-resource';

//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

export const register = (app: express.Application) => {
  const diagramResource = new DiagramResource();
  const tokenResource = new TokenResource();
  const router = express.Router();
  router.use(cors(options));

  // routes
  // tokens
  router.get('/tokens/:ownerToken/allTokens', (req, res) =>
    tokenResource.getAllTokensForOwnerToken(req as Request<TokenCreationData>, res),
  );

  // diagrams
  router.get('/diagrams/:token', (req, res) => diagramResource.getDiagram(req, res));
  router.post('/diagrams/publish', (req, res) => diagramResource.publishDiagram(req, res));
  router.put('/diagrams/:token', (req, res) => diagramResource.updateDiagram(req, res));

  app.use('/api', router);
};

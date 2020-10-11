import express from "express";
import cors from "cors";
import { createLink } from "./resources/link";
import { getDiagram, updateDiagram } from "./resources/diagram";

//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

export const register = ( app: express.Application ) => {
  const router = express.Router();
  router.use(cors(options));

  // routes
  // links
  router.post('/links', (req, res) => createLink(req, res));

  // diagrams
  router.get('/diagrams/:link', (req, res) => getDiagram(req, res));
  router.put('/diagrams/:link', (req, res) => updateDiagram(req, res));

  app.use('/api', router);
}

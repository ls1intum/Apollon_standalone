import express from 'express';
import { createLink } from './resources/link';
import { getDiagram } from './resources/diagram';
import bodyParser from 'body-parser';
import * as path from 'path';
import cors from 'cors';

const port = 3333;

const webappPath = `../../dist`;

export const app = express();
app.use('/', express.static(webappPath));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
//options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

// routes
export const router = express.Router();
router.use(cors(options));
router.post('/links', (req, res) => createLink(req, res));
router.get('/diagrams', getDiagram);
app.use('/api', router);

app.get('/*', (req, res) => {
  console.log(__dirname);
  res.sendFile(path.resolve(`${webappPath}/index.html`));
});

app.listen(port, () => {
  console.log('Apollon Standalone Server listening at http://localhost:%s', port);
});

import express from 'express';
import { createLink } from './resources/link';
import { getDiagram } from './resources/diagram';
import bodyParser from 'body-parser';
import * as path from 'path';

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

// routes
export const router = express.Router();
router.post('/link', (req, res) => createLink(req, res));
router.get('/diagram', getDiagram);
router.get('/*', (req, res) => {
  console.log(__dirname);
  res.sendFile(path.resolve(`${webappPath}/index.html`));
});
app.use('/', router);

app.listen(port, () => {
  console.log('Apollon Standalone Server listening at http://localhost:%s', port);
});

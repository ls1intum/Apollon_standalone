import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import express, { RequestHandler } from 'express';
import { indexHtml, webappPath } from './constants';
import { register } from './routes';
import { CollaborationService } from './services/collaboration-service/collaboration-service';

const port = 8080;

const app = express();

// Rewrite baked-in localhost URLs in the built webapp to the deployment URL.
const jsFiles = fs.readdirSync(webappPath).filter((file) => file.endsWith('.js'));
jsFiles.forEach((file) => {
  const filePath = path.join(webappPath, file);
  const content = fs
    .readFileSync(filePath, 'utf8')
    .replace(/http:\/\/localhost:8080/g, process.env.DEPLOYMENT_URL || 'http://localhost:8080');
  fs.writeFileSync(filePath, content);
});

app.use('/', express.static(webappPath));
app.use(bodyParser.json() as RequestHandler);
app.use(
  bodyParser.urlencoded({
    extended: true,
  }) as RequestHandler,
);

// Register API routes before the SPA fallback.
register(app);

// SPA fallback; must stay after API/static routes.
app.get('/*path', (req, res) => {
  res.sendFile(indexHtml);
});
const collaborationService = new CollaborationService();

const server = app.listen(port, () => {
  console.log('Apollon Standalone Server listening at http://localhost:%s', port);
});

server.on('upgrade', (request, socket, head) => {
  collaborationService.handleUpgrade(request, socket, head);
});

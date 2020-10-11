import express from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import * as routes from './routes';

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

routes.register(app);

// if nothing matches return webapp
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(`${webappPath}/index.html`));
});

app.listen(port, () => {
  console.log('Apollon Standalone Server listening at http://localhost:%s', port);
});

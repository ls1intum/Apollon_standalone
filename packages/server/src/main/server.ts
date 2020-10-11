import express from 'express';
import bodyParser from 'body-parser';
import * as routes from './routes';
import { indexHtml, webappPath } from './constants';
// imported for ORM
import 'reflect-metadata';
import { createConnection } from 'typeorm';

const port = 3333;

export const app = express();

export const defaultConnectionPool = createConnection()
  .then(async (connection) => {
    console.log('Connection to database established');
    app.use('/', express.static(webappPath));
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );

    routes.register(app);
    // if nothing matches return webapp
    // must be registered after other routes
    app.get('/*', (req, res) => {
      res.sendFile(indexHtml);
    });
  })
  .catch((error) => console.log(error));

app.listen(port, () => {
  console.log('Apollon Standalone Server listening at http://localhost:%s', port);
});

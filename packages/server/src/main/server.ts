import express from 'express';
import bodyParser from 'body-parser';
import { register } from './routes';
import { indexHtml, webappPath } from './constants';
//@ts-ignore
import WebSocket from 'ws';
import { DiagramFileStorageService } from './services/diagram-storage/diagram-file-storage-service';
import { randomString } from './utils';

const port = 8080;

export const app = express();

app.use('/', express.static(webappPath));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// registers routes
register(app);

// if nothing matches return webapp
// must be registered after other routes
app.get('/*', (req, res) => {
  res.sendFile(indexHtml);
});

const clients: { [key: string]: string } = {};

const wsServer = new WebSocket.Server({ noServer: true });

const getTokenClients = (id: string, deleteClient: boolean) => {
  const token = clients[id];
  if (deleteClient) {
    delete clients[id];
  }
  return Object.values(clients).filter((clientToken) => {
    return clientToken === token;
  });
};

const onConnectionLost = (socket: any) => {
  const tokenClients = getTokenClients(socket.apollonId, true);
  wsServer.clients.forEach(function each(clientSocket: any) {
    if (clientSocket !== socket && clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(JSON.stringify({ count: tokenClients.length }));
    }
  });
};

const onConnection = (socket: any, token: string) => {
  clients[socket.apollonId] = token;
  const tokenClients = getTokenClients(socket.apollonId, false);
  wsServer.clients.forEach(function each(clientSocket: any) {
    if (
      clientSocket !== socket &&
      clientSocket.readyState === WebSocket.OPEN &&
      tokenClients.includes(clientSocket.apollonId)
    ) {
      clientSocket.send(JSON.stringify({ count: tokenClients.length }));
    }
  });
};

const onDiagramUpdate = (socket: any, token: string, diagram: any) => {
  const diagramService = new DiagramFileStorageService();
  diagramService.saveDiagram(diagram, token, true);
  clients[socket.apollonId] = token;
  const tokenClients = getTokenClients(socket.apollonId, false);
  wsServer.clients.forEach(function each(clientSocket: any) {
    if (
      clientSocket !== socket &&
      clientSocket.readyState === WebSocket.OPEN &&
      clients[clientSocket.apollonId] === token
    ) {
      clientSocket.send(JSON.stringify({ count: tokenClients.length, diagram }));
    }
  });
};

const interval = setInterval(function ping() {
  wsServer.clients.forEach(function each(ws: any) {
    if (ws.isAlive === false) {
      onConnectionLost(ws);
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 2000);

wsServer.on('connection', (socket: any) => {
  socket.apollonId = randomString(15);
  socket.isAlive = true;
  socket.on('pong', function () {
    socket.isAlive = true;
  });
  socket.on('message', (message: any) => {
    const { token, diagram } = JSON.parse(message);
    if (token) {
      if (diagram) {
        onDiagramUpdate(socket, token, diagram);
      } else {
        onConnection(socket, token);
      }
    }
  });
  socket.on('close', () => {
    onConnectionLost(socket);
  });
});

wsServer.on('close', function close() {
  clearInterval(interval);
});

const server = app.listen(port, () => {
  console.log('Apollon Standalone Server listening at http://localhost:%s', port);
});

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket: any) => {
    wsServer.emit('connection', socket, request);
  });
});

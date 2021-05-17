//@ts-ignore
import WebSocket from 'ws';
import { randomString } from '../../utils';
import { DiagramFileStorageService } from '../diagram-storage/diagram-file-storage-service';

type Client = { token: string; name: string };

export class CollaborationService {
  private wsServer: any;
  private clients: { [key: string]: Client } = {};
  private diagramService: DiagramFileStorageService;
  private interval: NodeJS.Timeout;
  constructor() {
    this.wsServer = new WebSocket.Server({ noServer: true });
    this.diagramService = new DiagramFileStorageService();
    this.interval = setInterval(() => {
      this.wsServer.clients.forEach((ws: any) => {
        if (ws.isAlive === false) {
          this.onConnectionLost(ws);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping(() => {});
      });
    }, 2000);
    this.wsServer.on('connection', (socket: any) => {
      socket.apollonId = randomString(15);
      socket.isAlive = true;
      socket.on('pong', function () {
        socket.isAlive = true;
      });
      socket.on('message', (message: any) => {
        const { token, name, diagram } = JSON.parse(message);
        if (token) {
          if (diagram) {
            this.onDiagramUpdate(socket, token, name, diagram);
          } else {
            this.onConnection(socket, token, name);
          }
        } else {
          if (name) {
            this.onNameUpdate(socket, name);
          }
        }
      });
      socket.on('close', () => {
        this.onConnectionLost(socket);
      });
    });

    this.wsServer.on('close', () => {
      clearInterval(this.interval);
    });
  }

  getTokenClients = (id: string, deleteClient: boolean) => {
    const token = this.clients[id].token;
    if (deleteClient) {
      delete this.clients[id];
    }
    return Object.values(this.clients).filter((client) => {
      return client.token === token;
    });
  };

  onConnectionLost = (socket: any) => {
    const tokenClients = this.getTokenClients(socket.apollonId, true);
    const token = this.clients[socket.apollonId].token;
    this.wsServer.clients.forEach((clientSocket: any) => {
      if (
        clientSocket !== socket &&
        clientSocket.readyState === WebSocket.OPEN &&
        this.clients[clientSocket.apollonId].token === token
      ) {
        clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.name) }));
      }
    });
  };

  onNameUpdate = (socket: any, name: string) => {
    this.clients[socket.apollonId] = { ...this.clients[socket.apollonId], name };
    const token = this.clients[socket.apollonId].token;
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.wsServer.clients.forEach((clientSocket: any) => {
      if (clientSocket.readyState === WebSocket.OPEN && this.clients[clientSocket.apollonId].token === token) {
        clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.name) }));
      }
    });
  };

  onConnection = (socket: any, token: string, name: string) => {
    this.clients[socket.apollonId] = { token, name };
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.wsServer.clients.forEach((clientSocket: any) => {
      if (clientSocket.readyState === WebSocket.OPEN && this.clients[clientSocket.apollonId].token === token) {
        if (clientSocket === socket) {
          this.diagramService.getDiagramByLink(token).then((diagram) => {
            clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.name), diagram }));
          });
        } else {
          clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.name) }));
        }
      }
    });
  };

  onDiagramUpdate = (socket: any, token: string, name: string, diagram: any) => {
    const diagramService = new DiagramFileStorageService();
    diagramService.saveDiagram(diagram, token, true);
    this.clients[socket.apollonId] = { token, name };
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.wsServer.clients.forEach((clientSocket: any) => {
      if (
        clientSocket !== socket &&
        clientSocket.readyState === WebSocket.OPEN &&
        this.clients[clientSocket.apollonId].token === token
      ) {
        clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.name), diagram }));
      }
    });
  };

  handleUpgrade = (request: any, socket: any, head: any) => {
    this.wsServer.handleUpgrade(request, socket, head, (socket: any) => {
      this.wsServer.emit('connection', socket, request);
    });
  };
}

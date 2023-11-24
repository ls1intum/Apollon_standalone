import WebSocket from 'ws';
import { randomString } from '../../utils';
import { DiagramFileStorageService } from '../diagram-storage/diagram-file-storage-service';
import { Collaborator } from 'shared/src/main/collaborator-dto';
import { SelectionChange } from 'shared/src/main/selection-dto';
import { applyPatch } from 'fast-json-patch';
import { Patch } from '@ls1intum/apollon';

type Client = { token: string; collaborator: Collaborator };

export class CollaborationService {
  private wsServer: any;
  private clients: { [key: string]: Client } = {};
  private diagramService: DiagramFileStorageService;
  private readonly interval: NodeJS.Timeout;
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
        // tslint:disable-next-line:no-empty
        ws.ping(() => {});
      });
    }, 2000);
    this.wsServer.on('connection', (socket: any) => {
      socket.apollonId = randomString(15);
      socket.isAlive = true;
      socket.on('pong', () => {
        socket.isAlive = true;
      });
      socket.on('message', (message: any) => {
        const { token, collaborator, patch, selection } = JSON.parse(message);
        if (token) {
          if (patch) {
            this.onDiagramPatch(socket, token, patch, collaborator);
          } else if (selection) {
            this.onSelection(socket, token, selection, collaborator);
          } else {
            this.onConnection(socket, token, collaborator);
          }
        } else {
          // Case where only collaborator object is updated
          if (collaborator?.name !== '') {
            this.onCollaboratorUpdate(socket, collaborator);
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
    const token = this.clients[id]?.token;
    if (deleteClient) {
      delete this.clients[id];
    }
    return Object.values(this.clients).filter((client) => {
      return client?.token === token;
    });
  };

  onConnectionLost = (socket: any) => {
    const token = this.clients[socket.apollonId]?.token;
    const tokenClients = this.getTokenClients(socket.apollonId, true);

    this.wsServer.clients.forEach((clientSocket: any) => {
      if (
        clientSocket !== socket &&
        clientSocket.readyState === WebSocket.OPEN &&
        this.clients[clientSocket.apollonId]?.token === token
      ) {
        clientSocket.send(
          JSON.stringify({
            token,
            collaborators: tokenClients.map((client) => client.collaborator),
          }),
        );
      }
    });
  };

  onCollaboratorUpdate = (socket: any, collaborator: Collaborator) => {
    this.clients[socket.apollonId] = { ...this.clients[socket.apollonId], collaborator };
    const token = this.clients[socket.apollonId]?.token;
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.wsServer.clients.forEach((clientSocket: any) => {
      if (clientSocket.readyState === WebSocket.OPEN && this.clients[clientSocket.apollonId].token === token) {
        clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborator) }));
      }
    });
  };

  onConnection = (socket: any, token: string, collaborator: Collaborator) => {
    this.clients[socket.apollonId] = { token, collaborator };
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.wsServer.clients.forEach((clientSocket: any) => {
      if (clientSocket.readyState === WebSocket.OPEN && this.clients[clientSocket.apollonId]?.token === token) {
        if (clientSocket === socket) {
          this.diagramService.getDiagramByLink(token).then((diagram) => {
            clientSocket.send(
              JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborator), diagram }),
            );
          });
        } else {
          clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborator) }));
        }
      }
    });
  };

  onDiagramPatch = async (socket: any, token: string, patch: Patch, collaborator: Collaborator) => {
    const diagram = await this.diagramService.getDiagramByLink(token);
    diagram!.model = applyPatch(diagram!.model, patch).newDocument;
    this.diagramService.saveDiagram(diagram!, token, true);

    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.clients[socket.apollonId] = { token, collaborator };

    this.wsServer.clients.forEach((clientSocket: any) => {
      if (
        clientSocket.readyState === WebSocket.OPEN &&
        this.clients[clientSocket.apollonId]?.token === token
      ) {
        clientSocket.send(
          JSON.stringify({
            collaborators: tokenClients.map((client) => client.collaborator),
            patch,
            originator: collaborator
          }),
        );
      }
    });
  };

  onSelection = async (socket: any, token: string, selection: SelectionChange, collaborator: Collaborator) => {
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.clients[socket.apollonId] = { token, collaborator };

    this.wsServer.clients.forEach((clientSocket: any) => {
      if (
        clientSocket !== socket &&
        clientSocket.readyState === WebSocket.OPEN &&
        this.clients[clientSocket.apollonId]?.token === token
      ) {
        clientSocket.send(
          JSON.stringify({
            collaborators: tokenClients.map((client) => client.collaborator),
            selection,
            originator: collaborator
          }),
        );
      }
    });
  };

  handleUpgrade = (request: any, socket: any, head: any) => {
    this.wsServer.handleUpgrade(request, socket, head, (socket: any) => {
      this.wsServer.emit('connection', socket, request);
    });
  };
}

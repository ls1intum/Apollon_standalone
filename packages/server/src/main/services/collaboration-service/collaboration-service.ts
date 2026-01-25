import WebSocket, { WebSocketServer } from 'ws';
import type { RawData } from 'ws';
import type { IncomingMessage } from 'http';
import type { Socket } from 'net';
import type { Duplex } from 'stream';
import { randomString } from '../../utils';
import { DiagramStorageFactory, DiagramStorageService } from '../diagram-storage';
import { Collaborator, SelectionChange } from 'shared';
import type { Patch } from '@ls1intum/apollon';

type Client = { token: string; collaborator: Collaborator };
type ApollonSocket = WebSocket & { apollonId: string; isAlive: boolean };
type CollaborationMessage = {
  token?: string;
  collaborator?: Collaborator;
  patch?: Patch;
  selection?: SelectionChange;
};

export class CollaborationService {
  private wsServer: WebSocketServer;
  private clients: Record<string, Client> = {};
  private diagramService: DiagramStorageService;
  private readonly interval: NodeJS.Timeout;
  constructor() {
    this.wsServer = new WebSocketServer({ noServer: true });
    this.diagramService = DiagramStorageFactory.getStorageService();
    this.interval = setInterval(() => {
      this.wsServer.clients.forEach((ws) => {
        const socket = ws as ApollonSocket;
        if (socket.isAlive === false) {
          this.onConnectionLost(socket);
          return socket.terminate();
        }
        socket.isAlive = false;
        socket.ping();
      });
    }, 2000);
    this.wsServer.on('connection', (socket: WebSocket) => {
      const clientSocket = socket as ApollonSocket;
      clientSocket.apollonId = randomString(15);
      clientSocket.isAlive = true;
      clientSocket.on('pong', () => {
        clientSocket.isAlive = true;
      });
      clientSocket.on('message', (message: RawData) => {
        const { token, collaborator, patch, selection } = JSON.parse(message.toString()) as CollaborationMessage;
        if (token) {
          if (patch && collaborator) {
            this.onDiagramPatch(clientSocket, token, patch, collaborator);
          } else if (selection && collaborator) {
            this.onSelection(clientSocket, token, selection, collaborator);
          } else if (collaborator) {
            this.onConnection(clientSocket, token, collaborator);
          }
        } else if (collaborator && collaborator.name !== '') {
          // Case where only collaborator object is updated
          this.onCollaboratorUpdate(clientSocket, collaborator);
        }
      });
      clientSocket.on('close', () => {
        this.onConnectionLost(clientSocket);
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

  onConnectionLost = (socket: ApollonSocket) => {
    const token = this.clients[socket.apollonId]?.token;
    const tokenClients = this.getTokenClients(socket.apollonId, true);

    this.wsServer.clients.forEach((clientSocket) => {
      const apollonSocket = clientSocket as ApollonSocket;
      if (
        apollonSocket !== socket &&
        apollonSocket.readyState === WebSocket.OPEN &&
        this.clients[apollonSocket.apollonId]?.token === token
      ) {
        apollonSocket.send(
          JSON.stringify({
            token,
            collaborators: tokenClients.map((client) => client.collaborator),
          }),
        );
      }
    });
  };

  onCollaboratorUpdate = (socket: ApollonSocket, collaborator: Collaborator) => {
    this.clients[socket.apollonId] = { ...this.clients[socket.apollonId], collaborator };
    const token = this.clients[socket.apollonId]?.token;
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.wsServer.clients.forEach((clientSocket) => {
      const apollonSocket = clientSocket as ApollonSocket;
      if (apollonSocket.readyState === WebSocket.OPEN && this.clients[apollonSocket.apollonId].token === token) {
        apollonSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborator) }));
      }
    });
  };

  onConnection = (socket: ApollonSocket, token: string, collaborator: Collaborator) => {
    this.clients[socket.apollonId] = { token, collaborator };
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.wsServer.clients.forEach((clientSocket) => {
      const apollonSocket = clientSocket as ApollonSocket;
      if (apollonSocket.readyState === WebSocket.OPEN && this.clients[apollonSocket.apollonId]?.token === token) {
        if (apollonSocket === socket) {
          this.diagramService.getDiagramByLink(token).then((diagram) => {
            apollonSocket.send(
              JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborator), diagram }),
            );
          });
        } else {
          apollonSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborator) }));
        }
      }
    });
  };

  onDiagramPatch = async (socket: ApollonSocket, token: string, patch: Patch, collaborator: Collaborator) => {
    await this.diagramService.patchDiagram(token, patch);
    // const diagram = await this.diagramService.getDiagramByLink(token);
    // diagram!.model = applyPatch(diagram!.model, patch).newDocument;
    // this.diagramService.saveDiagram(diagram!, token, true);

    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.clients[socket.apollonId] = { token, collaborator };

    this.wsServer.clients.forEach((clientSocket) => {
      const apollonSocket = clientSocket as ApollonSocket;
      if (apollonSocket.readyState === WebSocket.OPEN && this.clients[apollonSocket.apollonId]?.token === token) {
        apollonSocket.send(
          JSON.stringify({
            collaborators: tokenClients.map((client) => client.collaborator),
            patch,
            originator: collaborator,
          }),
        );
      }
    });
  };

  onSelection = async (socket: ApollonSocket, token: string, selection: SelectionChange, collaborator: Collaborator) => {
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.clients[socket.apollonId] = { token, collaborator };

    this.wsServer.clients.forEach((clientSocket) => {
      const apollonSocket = clientSocket as ApollonSocket;
      if (
        apollonSocket !== socket &&
        apollonSocket.readyState === WebSocket.OPEN &&
        this.clients[apollonSocket.apollonId]?.token === token
      ) {
        apollonSocket.send(
          JSON.stringify({
            collaborators: tokenClients.map((client) => client.collaborator),
            selection,
            originator: collaborator,
          }),
        );
      }
    });
  };

  handleUpgrade = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    this.wsServer.handleUpgrade(request, socket as Socket, head, (clientSocket) => {
      this.wsServer.emit('connection', clientSocket, request);
    });
  };
}

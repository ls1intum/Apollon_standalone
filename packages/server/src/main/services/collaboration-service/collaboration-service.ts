//@ts-ignore
import WebSocket from 'ws';
import { randomString } from '../../utils';
import { DiagramFileStorageService } from '../diagram-storage/diagram-file-storage-service';
import { Collaborator } from 'shared/src/main/collaborator-dto';
import { UMLElement } from '@ls1intum/apollon';

type Client = { token: string; collaborators: Collaborator };

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
        const { token, collaborators, diagram, selectedElements } = JSON.parse(message);
        if (token) {
          if (diagram) {
            this.onDiagramUpdate(socket, token, collaborators, diagram, selectedElements);
          } else {
            this.onConnection(socket, token, collaborators);
          }
        } else {
          // Case where only collaborator object is updated
          if (collaborators?.name !== '') {
            this.onCollaboratorUpdate(socket, collaborators);
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

  // TODO: Test this.
  onConnectionLost = (socket: any) => {
    const token = this.clients[socket.apollonId]?.token;
    const tokenClients = this.getTokenClients(socket.apollonId, true);

    this.wsServer.clients.forEach((clientSocket: any) => {
      if (
        clientSocket !== socket &&
        clientSocket.readyState === WebSocket.OPEN &&
        this.clients[clientSocket.apollonId]?.token === token
      ) {
        clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborators) }));
      }
    });
  };

  onCollaboratorUpdate = (socket: any, collaborators: Collaborator) => {
    this.clients[socket.apollonId] = { ...this.clients[socket.apollonId], collaborators };
    const token = this.clients[socket.apollonId]?.token;
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.wsServer.clients.forEach((clientSocket: any) => {
      if (clientSocket.readyState === WebSocket.OPEN && this.clients[clientSocket.apollonId].token === token) {
        clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborators) }));
      }
    });
  };

  onConnection = (socket: any, token: string, collaborators: Collaborator) => {
    this.clients[socket.apollonId] = { token, collaborators };
    const tokenClients = this.getTokenClients(socket.apollonId, false);
    this.wsServer.clients.forEach((clientSocket: any) => {
      if (clientSocket.readyState === WebSocket.OPEN && this.clients[clientSocket.apollonId]?.token === token) {
        if (clientSocket === socket) {
          this.diagramService.getDiagramByLink(token).then((diagram) => {
            clientSocket.send(
              JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborators), diagram }),
            );
          });
        } else {
          clientSocket.send(JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborators) }));
        }
      }
    });
  };

  onDiagramUpdate = (socket: any, token: string, collaborators: Collaborator, diagram: any, selectedElements: any) => {
    const diagramService = new DiagramFileStorageService();
    diagramService.saveDiagram(diagram, token, true);
    this.clients[socket.apollonId] = { token, collaborators };
    const tokenClients = this.getTokenClients(socket.apollonId, false);

    this.wsServer.clients.forEach((clientSocket: any) => {
      if (
        clientSocket !== socket &&
        clientSocket.readyState === WebSocket.OPEN &&
        this.clients[clientSocket.apollonId]?.token === token
      ) {
        if (selectedElements) {
          const selElemIds = selectedElements;
          const elements = diagram.model.elements.map(({ selectedBy, ...elem }: any) => elem);
          const updatedElem = elements?.map((x: UMLElement) =>
            selElemIds.includes(x.id)
              ? { ...x, selectedBy: { elementId: x.id, name: collaborators.name, color: collaborators.color } }
              : { ...x },
          );

          if (diagram && diagram.model && diagram.model.elements) {
            diagram.model.elements = updatedElem!;
          }
        }

        clientSocket.send(
          JSON.stringify({ collaborators: tokenClients.map((client) => client.collaborators), diagram }),
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

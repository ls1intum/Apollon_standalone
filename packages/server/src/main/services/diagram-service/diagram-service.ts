import { randomString } from '../../utils.js';
import { tokenLength } from '../../constants.js';
import { DiagramStorageService } from '../diagram-storage/diagram-storage-service.js';
import { DiagramDTO } from 'shared/src/main/diagram-dto.js';

export class DiagramService {
  private storageService: DiagramStorageService;

  constructor(storageService: DiagramStorageService) {
    this.storageService = storageService;
  }

  saveDiagramAndGenerateTokens(diagramDTO: DiagramDTO): Promise<string> {
    // alpha numeric token with length = tokenLength
    const token = randomString(tokenLength);
    return this.storageService.saveDiagram(diagramDTO, token);
  }
  getDiagramByLink(token: string): Promise<DiagramDTO | undefined> {
    return this.storageService.getDiagramByLink(token);
  }
}

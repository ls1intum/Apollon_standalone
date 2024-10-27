import { randomString } from '../../utils';
import { tokenLength } from '../../constants';
import { DiagramStorageService } from '../diagram-storage/diagram-storage-service';
import { DiagramDTO } from 'shared';

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

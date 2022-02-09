import { FileStorageService } from '../storage-service/file-storage-service.js';
import { DiagramDTO } from '../../../../../shared/src/main/diagram-dto.js';
import { diagramStoragePath } from '../../constants.js';
import { DiagramStorageService } from './diagram-storage-service.js';

export class DiagramFileStorageService implements DiagramStorageService {
  private fileStorageService: FileStorageService = new FileStorageService();

  saveDiagram(diagramDTO: DiagramDTO, token: string, shared: boolean = false): Promise<string> {
    // alpha numeric token with length = tokenLength
    const path = this.getFilePathForToken(token);
    return this.fileStorageService.doesFileExist(path).then((exists) => {
      if (exists && !shared) {
        throw Error(`File at ${path} already exists`);
      } else {
        return this.fileStorageService.saveContentToFile(path, JSON.stringify(diagramDTO)).then(() => token);
      }
    });
  }
  getDiagramByLink(token: string): Promise<DiagramDTO | undefined> {
    const path = this.getFilePathForToken(token);
    return this.fileStorageService.getFileContent(path).then((fileContent) => JSON.parse(fileContent) as DiagramDTO);
  }

  private getFilePathForToken(token: string): string {
    return `${diagramStoragePath}/${token}.json`;
  }
}

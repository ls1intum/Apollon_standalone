import { DiagramDTO } from 'shared/src/main/diagram-dto';
import { FileStorageService } from '../storage-service/file-storage-service';
import { randomString } from '../../utils';
import { diagramStoragePath, tokenLength } from '../../constants';
import { DiagramService } from './diagram-service';

export class FileDiagramService implements DiagramService {
  private fileStorageService: FileStorageService = new FileStorageService();

  /**
   * saves the diagram (if no file for diagram yet exists) and generates tokens which are used to access the diagram in different views
   * @param diagramDTO
   * @returns editor token which gives full right to edit and share the diagram
   */
  saveDiagramAndGenerateTokens(diagramDTO: DiagramDTO): Promise<string> {
    // alpha numeric token with length = tokenLength
    const token = randomString(tokenLength);
    const path = this.getFilePathForToken(token);
    return this.fileStorageService.doesFileExist(path).then((exists) => {
      if (exists) {
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

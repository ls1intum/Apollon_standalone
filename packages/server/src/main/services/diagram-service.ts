import { DiagramView } from "shared/src/diagram-view";
import { DiagramDTO } from "shared/src/diagram-dto";
import { TokenDTO } from "shared/src/token-dto";
import { FileStorageService } from "./storage-service/file-storage-service";
import { diagramStoragePath, tokenLength } from "../constants";
import { randomString } from "../utils";

export class DiagramService {
  private fileStorageService: FileStorageService = new FileStorageService();

  /**
   * saves the diagram (if no file for diagram yet exists) and generates tokens which are used to access the diagram in different views
   * @param diagramDTO
   * @returns editor token which gives full right to edit and share the diagram
   */
  saveDiagramAndGenerateTokens(diagramDTO: DiagramDTO): Promise<TokenDTO[]> {
    // alpha numeric token with length = tokenLength
    const token = randomString(tokenLength);
    const path = this.getFilePathForToken(token);
    return this.fileStorageService.doesFileExist(path).then((exists) => {
      if (exists) {
        throw Error(`File at ${path} already exists`);
      } else {
        return this.fileStorageService.saveContentToFile(path, JSON.stringify(diagramDTO)).then(() => {
          return [DiagramView.EDIT, DiagramView.FEEDBACK].map((view) => new TokenDTO(view, token));
        });
      }
    });
  }

  getDiagramByLink(token: string): Promise<DiagramDTO | undefined> {
    const path = this.getFilePathForToken(token);
    return this.fileStorageService.getFileContent(path).then((fileContent) => JSON.parse(fileContent) as DiagramDTO);
  }

  getFilePathForToken(token: string): string {
    return `${diagramStoragePath}/${token}.json`;
  }
}

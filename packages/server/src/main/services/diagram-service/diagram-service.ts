import { randomString } from '../../utils';
import { tokenLength } from '../../constants';
import { DiagramStorageService } from '../diagram-storage/diagram-storage-service';
import { DiagramDTO } from 'shared/src/main/diagram-dto';

export class DiagramService {
  private storageService: DiagramStorageService;

  constructor(storageService: DiagramStorageService) {
    this.storageService = storageService;
  }

  async saveDiagramVersion(diagramDTO: DiagramDTO, existingToken?: string): Promise<string> {
    const diagramExists = existingToken !== undefined && (await this.storageService.diagramExists(existingToken));
    const token = diagramExists ? existingToken : randomString(tokenLength);
    const diagram = !diagramExists ? diagramDTO : await this.getDiagramByLink(token);

    if (diagram === undefined) {
      throw Error(`Could not retrieve a saved diagram with the token ${token}`);
    }

    if (diagram.versions === undefined) {
      diagram.versions = [];
    }

    // versions of a diagram don't have their own versions
    const newDiagramVersion = Object.assign({}, diagramDTO);
    newDiagramVersion.versions = undefined;
    diagram.versions.push(newDiagramVersion);

    return await this.storageService.saveDiagram(diagram, token);
  }

  async deleteDiagramVersion(token: string, versionIndex: number): Promise<string> {
    const diagram = await this.getDiagramByLink(token);

    if (diagram === undefined) {
      throw Error(`Could not retrieve a saved diagram with the token ${token}`);
    }

    diagram.versions?.splice(versionIndex, 1);

    return await this.storageService.saveDiagram(diagram, token);
  }

  async editDiagramVersion(token: string, versionIndex: number, diagramVersion: DiagramDTO): Promise<string> {
    const diagram = await this.getDiagramByLink(token);

    if (diagram === undefined) {
      throw Error(`Could not retrieve a saved diagram with the token ${token}`);
    }

    diagram.versions![versionIndex] = diagramVersion;

    return await this.storageService.saveDiagram(diagram, token);
  }

  getDiagramByLink(token: string): Promise<DiagramDTO | undefined> {
    return this.storageService.getDiagramByLink(token);
  }
}

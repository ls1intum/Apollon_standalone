import { randomString } from '../../utils';
import { tokenLength } from '../../constants';
import { DiagramStorageService } from '../diagram-storage/diagram-storage-service';
import { DiagramDTO } from 'shared/src/main/diagram-dto';

export class DiagramService {
  private storageService: DiagramStorageService;

  constructor(storageService: DiagramStorageService) {
    this.storageService = storageService;
  }

  async saveDiagramVersion(
    diagramDTO: DiagramDTO,
    existingToken?: string,
  ): Promise<{ token: string; diagram: DiagramDTO }> {
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
    const { versions, ...diagramWithoutVersions } = diagramDTO;
    const newDiagramVersion = Object.assign({}, diagramWithoutVersions);

    diagram.versions.push(newDiagramVersion);
    await this.storageService.saveDiagram(diagram, token);

    return { token, diagram };
  }

  async deleteDiagramVersion(token: string, versionIndex: number): Promise<DiagramDTO> {
    const diagram = await this.getDiagramByLink(token);

    if (diagram === undefined) {
      throw Error(`Could not retrieve a saved diagram with the token ${token}`);
    }

    diagram.versions?.splice(versionIndex, 1);
    await this.storageService.saveDiagram(diagram, token);

    return diagram;
  }

  async editDiagramVersion(
    token: string,
    versionIndex: number,
    title: string,
    description: string,
  ): Promise<DiagramDTO> {
    const diagram = await this.getDiagramByLink(token);

    if (diagram === undefined) {
      throw Error(`Could not retrieve a saved diagram with the token ${token}`);
    }

    diagram.versions![versionIndex].title = title;
    diagram.versions![versionIndex].description = description;
    await this.storageService.saveDiagram(diagram, token);

    return diagram;
  }

  getDiagramByLink(token: string): Promise<DiagramDTO | undefined> {
    return this.storageService.getDiagramByLink(token);
  }
}

import { DiagramDTO } from 'shared/src/main/diagram-dto';

export interface DiagramStorageService {
  saveDiagram(diagramDTO: DiagramDTO, token: string): Promise<string>;
  getDiagramByLink(token: string): Promise<DiagramDTO | undefined>;
}

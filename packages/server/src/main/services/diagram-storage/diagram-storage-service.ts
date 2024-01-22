import { DiagramDTO } from 'shared/src/main/diagram-dto';
import { Operation } from 'fast-json-patch';

export interface DiagramStorageService {
  saveDiagram(diagramDTO: DiagramDTO, token: string): Promise<string>;
  getDiagramByLink(token: string): Promise<DiagramDTO | undefined>;
  patchDiagram(token: string, patch: Operation[]): Promise<void>;
  diagramExists(token: string): Promise<boolean>;
}

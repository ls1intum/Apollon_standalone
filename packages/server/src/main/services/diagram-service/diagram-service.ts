import { DiagramDTO } from '../../../../../shared/src/main/diagram-dto';

export interface DiagramService {
  saveDiagramAndGenerateTokens(diagramDTO: DiagramDTO): Promise<string>;
  getDiagramByLink(token: string): Promise<DiagramDTO | undefined>;
}

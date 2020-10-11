import { Diagram } from 'webapp/src/main/services/diagram/diagram-types';

export interface StorageService {
  getDiagram(diagramId: string): Promise<Diagram>;
  saveDiagram(diagramId: string, diagram: Diagram): Promise<void>;
}

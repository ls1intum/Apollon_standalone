import { Diagram } from 'webapp/src/main/services/diagram/diagram-types';
import { DiagramAccess } from '../../../../shared/diagram-access';
import { StorageService } from './storage-service/storage-service';
import { FileStorageService } from './storage-service/file-storage-service';

export class DiagramService {
  private storageService: StorageService = new FileStorageService();

  getDiagram(diagramId: string): Promise<Diagram> {
    return this.storageService.getDiagram(diagramId);
  }

  async updateOrCreateDiagram(diagram: Diagram, permission: DiagramAccess): Promise<void> {
    try {
      // update current diagram
      const currentDiagram = await this.getDiagram(diagram.id);
      const mergedDiagram = this.mergeDiagram(currentDiagram, diagram, permission);
      return this.storageService.saveDiagram(diagram.id, mergedDiagram);
    } catch (error) {
      // no diagram exists -> add diagram
      return this.storageService.saveDiagram(diagram.id, diagram);
    }
  }

  mergeDiagram(existingDiagram: Diagram, updatedDiagram: Diagram, permission: DiagramAccess): Diagram {
    let mergedDiagram: Diagram;
    switch (permission) {
      case DiagramAccess.EDIT:
        mergedDiagram = updatedDiagram;
        if (mergedDiagram.model && existingDiagram.model) {
          mergedDiagram.model.assessments = existingDiagram.model.assessments;
        }
        break;
      case DiagramAccess.FEEDBACK:
        mergedDiagram = existingDiagram;
        if (mergedDiagram.model && updatedDiagram.model) {
          mergedDiagram.model.assessments = updatedDiagram.model.assessments;
        }
        break;
      default:
        throw Error('Unknown permission for diagram');
    }
    return mergedDiagram;
  }
}

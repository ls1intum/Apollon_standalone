import { DiagramActionTypes, UpdateDiagramAction } from './diagram-types';
import { Diagram } from '../local-storage/local-storage-types';
import { UMLDiagramType } from '@ls1intum/apollon';

export const DiagramRepository = {
  updateDiagram: (diagram: Diagram, diagramType?: UMLDiagramType): UpdateDiagramAction => ({
    type: DiagramActionTypes.UPDATE_DIAGRAM,
    payload: {
      diagram,
      diagramType,
    },
  }),
};

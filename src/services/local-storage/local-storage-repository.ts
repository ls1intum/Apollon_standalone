import { UMLDiagramType } from '@ls1intum/apollon';
import { CreateDiagramAction, Diagram, LoadAction, LocalStorageActionTypes, StoreAction } from './local-storage-types';

export const LocalStorageRepository = {
  load: (id: string): LoadAction => ({
    type: LocalStorageActionTypes.LOAD,
    payload: {
      id,
    },
  }),

  createDiagram: (diagramTitle: string, diagramType: UMLDiagramType): CreateDiagramAction => ({
    type: LocalStorageActionTypes.CREATE_DIAGRAM,
    payload: {
      diagramType,
      diagramTitle,
    },
  }),

  store: (diagram: Diagram): StoreAction => ({
    type: LocalStorageActionTypes.STORE,
    payload: {
      diagram,
    },
  }),
};

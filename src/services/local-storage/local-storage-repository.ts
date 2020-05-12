import {UMLDiagramType, UMLModel} from '@ls1intum/apollon';
import { CreateDiagramAction, LoadAction, LocalStorageActionTypes, StoreAction } from './local-storage-types';

export const LocalStorageRepository = {
  load: (id: string): LoadAction => ({
    type: LocalStorageActionTypes.LOAD,
    payload: {
      id: id,
    },
  }),

  createDiagram: (diagramTitle: string, diagramType: UMLDiagramType): CreateDiagramAction => ({
    type: LocalStorageActionTypes.CREATE_DIAGRAM,
    payload: {
      diagramType,
      diagramTitle,
    },
  }),

  store: (id: string, title: string, model: UMLModel): StoreAction => ({
    type: LocalStorageActionTypes.STORE,
    payload: {
      id,
      title,
      model,
    },
  }),
};

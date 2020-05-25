import { Action } from 'redux';
import { Diagram } from '../local-storage/local-storage-types';
import { UMLDiagramType } from '@ls1intum/apollon';

export type DiagramActions = UpdateDiagramAction;

export const enum DiagramActionTypes {
  UPDATE_DIAGRAM = '@@diagram/update',
}

export type UpdateDiagramAction = Action<DiagramActionTypes.UPDATE_DIAGRAM> & {
  payload: {
    diagram: Diagram;
    diagramType?: UMLDiagramType;
  };
};

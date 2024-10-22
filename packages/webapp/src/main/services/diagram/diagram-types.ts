import { Action } from 'redux';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { Moment } from 'moment';

export type Diagram = {
  id: string;
  title: string;
  model?: UMLModel;
  lastUpdate: Moment;
  versions?: Diagram[];
  description?: string;
};

export type DiagramActions = UpdateDiagramAction | CreateDiagramAction;

export const enum DiagramActionTypes {
  CREATE_DIAGRAM = '@@diagram/create_diagram',
  UPDATE_DIAGRAM = '@@diagram/update',
}

export type CreateDiagramAction = Action<DiagramActionTypes.CREATE_DIAGRAM> & {
  payload: {
    diagramTitle: string;
    diagramType: UMLDiagramType;
    template?: UMLModel;
  };
};

export type UpdateDiagramAction = Action<DiagramActionTypes.UPDATE_DIAGRAM> & {
  payload: {
    values: Partial<Diagram>;
  };
};

import { UMLDiagramType } from '@ls1intum/apollon';
import { ChangeDiagramTypeAction, EditorOptionsActionTypes } from './editor-options-types';

export const EditorOptionsRepository = {
  changeDiagramType: (diagramType: UMLDiagramType): ChangeDiagramTypeAction => ({
    type: EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE,
    payload: {
      type: diagramType,
    },
  }),
};

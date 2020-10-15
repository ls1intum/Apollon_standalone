import { ApollonMode, UMLDiagramType } from "@ls1intum/apollon";
import {
  ChangeDiagramTypeAction,
  ChangeEditorModeAction,
  ChangeReadonlyModeAction,
  EditorOptionsActionTypes
} from "./editor-options-types";

export const EditorOptionsRepository = {
  changeDiagramType: (diagramType: UMLDiagramType): ChangeDiagramTypeAction => ({
    type: EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE,
    payload: {
      type: diagramType
    }
  }),

  changeEditorMode: (editorMode: ApollonMode): ChangeEditorModeAction => ({
    type: EditorOptionsActionTypes.CHANGE_EDITOR_MODE,
    payload: {
      mode: editorMode
    }
  }),

  changeReadonlyMode: (readonly: boolean): ChangeReadonlyModeAction => ({
    type: EditorOptionsActionTypes.CHANGE_READONLY_MODE,
    payload: {
      readonly
    }
  })
};

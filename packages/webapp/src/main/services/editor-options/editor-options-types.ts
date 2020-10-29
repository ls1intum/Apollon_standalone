import { Action, DeepPartial } from 'redux';
import { UMLDiagramType } from '@ls1intum/apollon';
import { ApollonMode, Locale } from '@ls1intum/apollon/lib/services/editor/editor-types';
import { Styles } from '@ls1intum/apollon/lib/components/theme/styles';

export type EditorOptions = {
  type: UMLDiagramType;
  mode?: ApollonMode;
  readonly?: boolean;
  enablePopups?: boolean;
  enableCopyPaste?: boolean;
  theme?: DeepPartial<Styles>;
  locale: Locale;
};

export type EditorOptionsActions = ChangeDiagramTypeAction | ChangeEditorModeAction | ChangeReadonlyModeAction;

export const enum EditorOptionsActionTypes {
  CHANGE_DIAGRAM_TYPE = '@@editor-options/change_diagram_type',
  CHANGE_EDITOR_MODE = '@@editor-options/change_editor_mode',
  CHANGE_READONLY_MODE = '@@editor-options/change_readonly_mode',
}

export type ChangeDiagramTypeAction = Action<EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE> & {
  payload: {
    type: UMLDiagramType;
  };
};

export type ChangeEditorModeAction = Action<EditorOptionsActionTypes.CHANGE_EDITOR_MODE> & {
  payload: {
    mode: ApollonMode;
  };
};

export type ChangeReadonlyModeAction = Action<EditorOptionsActionTypes.CHANGE_READONLY_MODE> & {
  payload: {
    readonly: boolean;
  };
};

import { Action, DeepPartial } from 'redux';
import { UMLDiagramType } from '@ls1intum/apollon';
import { ApollonMode, Locale } from '@ls1intum/apollon/lib/services/editor/editor-types';
import { Styles } from '@ls1intum/apollon/lib/components/theme/styles';

export type EditorOptions = {
  type: UMLDiagramType;
  mode?: ApollonMode;
  readonly?: boolean;
  enablePopups?: boolean;
  theme?: DeepPartial<Styles>;
  locale: Locale;
};

export type EditorOptionsActions = ChangeDiagramTypeAction;

export const enum EditorOptionsActionTypes {
  CHANGE_DIAGRAM_TYPE = '@@editor-options/change_diagram_type',
}

export type ChangeDiagramTypeAction = Action<EditorOptionsActionTypes.CHANGE_DIAGRAM_TYPE> & {
  payload: {
    type: UMLDiagramType;
  };
};

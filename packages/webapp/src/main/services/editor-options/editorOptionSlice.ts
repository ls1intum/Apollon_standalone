import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UMLDiagramType } from '@ls1intum/apollon';
import { ApollonMode, Locale } from '@ls1intum/apollon/lib/es6/services/editor/editor-types';
import { Styles } from '@ls1intum/apollon/lib/es6/components/theme/styles';
import { DeepPartial } from 'redux';

export type EditorOptions = {
  type: UMLDiagramType;
  mode?: ApollonMode;
  readonly?: boolean;
  enablePopups?: boolean;
  enableCopyPaste?: boolean;
  theme?: DeepPartial<Styles>;
  locale: Locale;
  colorEnabled?: boolean;
};

export const defaultEditorOptions: EditorOptions = {
  type: UMLDiagramType.ClassDiagram,
  mode: ApollonMode.Modelling,
  readonly: false,
  enablePopups: true,
  enableCopyPaste: true,
  locale: Locale.en,
  colorEnabled: true,
};

const editorOptionsSlice = createSlice({
  name: 'editorOptions',
  initialState: defaultEditorOptions,
  reducers: {
    changeDiagramType(state, action: PayloadAction<UMLDiagramType>) {
      state.type = action.payload;
    },
    changeEditorMode(state, action: PayloadAction<ApollonMode>) {
      state.mode = action.payload;
    },
    changeReadonlyMode(state, action: PayloadAction<boolean>) {
      state.readonly = action.payload;
    },
  },
});

export const { changeDiagramType, changeEditorMode, changeReadonlyMode } = editorOptionsSlice.actions;

export const editorOptionsReducer = editorOptionsSlice.reducer;

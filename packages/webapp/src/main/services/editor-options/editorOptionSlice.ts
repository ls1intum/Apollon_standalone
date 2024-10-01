import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UMLDiagramType } from '@ls1intum/apollon';
import { ApollonMode, Locale } from '@ls1intum/apollon/lib/es6/services/editor/editor-types';
import { Styles } from '@ls1intum/apollon/lib/es6/components/theme/styles';
import { DeepPartial } from 'redux';

// Define the editor options type
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

// Define the initial/default state
export const defaultEditorOptions: EditorOptions = {
  type: UMLDiagramType.ClassDiagram,
  mode: ApollonMode.Modelling,
  readonly: false,
  enablePopups: true,
  enableCopyPaste: true,
  locale: Locale.en,
  colorEnabled: true,
};

// Create the slice
const editorOptionsSlice = createSlice({
  name: 'editorOptions',
  initialState: defaultEditorOptions,
  reducers: {
    // Action to change the diagram type
    changeDiagramType(state, action: PayloadAction< UMLDiagramType >) {
      state.type = action.payload;
    },
    // Action to change the editor mode
    changeEditorMode(state, action: PayloadAction< ApollonMode >) {
      state.mode = action.payload;
    },
    // Action to change readonly mode
    changeReadonlyMode(state, action: PayloadAction<boolean >) {
      state.readonly = action.payload;
    },
  },
});

// Export actions
export const { changeDiagramType, changeEditorMode, changeReadonlyMode } = editorOptionsSlice.actions;

// Export the reducer to be used in the store configuration
export const editorOptionsReducer = editorOptionsSlice.reducer;

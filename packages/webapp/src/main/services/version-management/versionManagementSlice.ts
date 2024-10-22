import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VersionManagementState = {
  displaySidebar: boolean;
  previewedDiagramIndex: number;
};

const initialState: VersionManagementState = {
  displaySidebar: false,
  previewedDiagramIndex: -1,
};

const versionManagementSlice = createSlice({
  name: 'versionManagement',
  initialState,
  reducers: {
    toggleSidebar(state, action: PayloadAction<void>) {
      state.displaySidebar = !state.displaySidebar;
    },
    setPreviewedDiagramIndex(state, action: PayloadAction<number>) {
      state.previewedDiagramIndex = action.payload;
    },
  },
  selectors: {
    selectDisplaySidebar: (state) => state.displaySidebar,
    selectPreviewedDiagramIndex: (state) => state.previewedDiagramIndex,
  },
});

export const { toggleSidebar, setPreviewedDiagramIndex } = versionManagementSlice.actions;

export const { selectDisplaySidebar, selectPreviewedDiagramIndex } = versionManagementSlice.selectors;

export const versionManagementReducer = versionManagementSlice.reducer;

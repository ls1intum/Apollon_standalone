import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collaborator } from 'shared/src/main/collaborator-dto';

export type ShareState = {
  collaborationName: string;
  collaborationColor: string;
  collaborators: Collaborator[];
  fromServer: boolean;
};

const initialState: ShareState = {
  collaborationName: '',
  collaborationColor: '',
  collaborators: [],
  fromServer: false,
};

const shareSlice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    updateCollaborationName(state, action: PayloadAction<string>) {
      state.collaborationName = action.payload;
    },

    updateCollaborationColor(state, action: PayloadAction<string>) {
      state.collaborationColor = action.payload;
    },

    updateCollaborators(state, action: PayloadAction<Collaborator[]>) {
      state.collaborators = action.payload;
    },

    gotFromServer(state, action: PayloadAction<{ fromServer: boolean }>) {
      state.fromServer = action.payload.fromServer;
    },
  },
});

export const { updateCollaborationName, updateCollaborationColor, updateCollaborators, gotFromServer } =
  shareSlice.actions;

export const shareReducer = shareSlice.reducer;

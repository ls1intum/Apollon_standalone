import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collaborator } from 'shared/src/main/collaborator-dto';

// Define the ShareState type
export type ShareState = {
  collaborationName: string;
  collaborationColor: string;
  collaborators: Collaborator[];
  fromServer: boolean;
};

// Define the initial state
const initialState: ShareState = {
  collaborationName: '',
  collaborationColor: '',
  collaborators: [],
  fromServer: false,
};

// Create the share slice
const shareSlice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    // Action to update the collaboration name
    updateCollaborationName(state, action: PayloadAction<{ name: string }>) {
      state.collaborationName = action.payload.name;
    },
    // Action to update the collaboration color
    updateCollaborationColor(state, action: PayloadAction<{ color: string }>) {
      state.collaborationColor = action.payload.color;
    },
    // Action to update collaborators
    updateCollaborators(state, action: PayloadAction<{ collaborators: Collaborator[] }>) {
      state.collaborators = action.payload.collaborators;
    },
    // Action to set whether the data is from the server
    gotFromServer(state, action: PayloadAction<{ fromServer: boolean }>) {
      state.fromServer = action.payload.fromServer;
    },
  },
});

// Export actions to be used in components or thunks
export const {
  updateCollaborationName,
  updateCollaborationColor,
  updateCollaborators,
  gotFromServer,
} = shareSlice.actions;

// Export the reducer to be used in the store
export const shareReducer = shareSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalContentType, ModalSize } from '../../components/modals/application-modal-types';

export type ModalState = {
  type: ModalContentType | null;
  size: ModalSize;
};

// Define the initial state for the modal
const initialState: ModalState = {
  type: null,
  size: 'sm', // Default size to 'sm'
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    // Action to show the modal
    showModal: (state, action: PayloadAction<{ type: ModalContentType; size?: ModalSize }>) => {
      state.type = action.payload.type;
      state.size = action.payload.size ?? 'sm'; // Default size is 'sm' if not provided
    },
    // Action to hide the modal
    hideModal: (state) => {
      state.type = null;
      state.size = 'sm'; // Reset size to 'sm' when modal is hidden
    },
  },
});

// Export the actions to be used in components
export const { showModal, hideModal } = modalSlice.actions;

// Export the reducer to be used in the store
export const modalReducer = modalSlice.reducer;

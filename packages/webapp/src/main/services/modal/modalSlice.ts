import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalContentType, ModalSize } from '../../components/modals/application-modal-types';

export type ModalState = {
  type: ModalContentType | null;
  size: ModalSize;
};

const initialState: ModalState = {
  type: null,
  size: 'sm',
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<{ type: ModalContentType; size?: ModalSize }>) => {
      state.type = action.payload.type;
      state.size = action.payload.size ?? 'sm';
    },

    hideModal: (state) => {
      state.type = null;
      state.size = 'sm';
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;

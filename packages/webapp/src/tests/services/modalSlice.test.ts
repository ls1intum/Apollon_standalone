import { describe, it, expect } from 'vitest';
import { modalReducer, showModal, hideModal, ModalState } from '../../main/services/modal/modalSlice';
import { ModalContentType } from '../../main/components/modals/application-modal-types';

describe('modalSlice', () => {
  const initialState: ModalState = {
    type: null,
    size: undefined,
  };

  describe('showModal', () => {
    it('should set modal type when showing a modal', () => {
      const result = modalReducer(initialState, showModal({ type: ModalContentType.HelpModelingModal }));

      expect(result.type).toBe(ModalContentType.HelpModelingModal);
      expect(result.size).toBeUndefined();
    });

    it('should set modal type and size when both are provided', () => {
      const result = modalReducer(initialState, showModal({ type: ModalContentType.ShareModal, size: 'lg' }));

      expect(result.type).toBe(ModalContentType.ShareModal);
      expect(result.size).toBe('lg');
    });

    it('should replace previous modal when showing a new one', () => {
      const stateWithModal: ModalState = {
        type: ModalContentType.HelpModelingModal,
        size: 'sm',
      };

      const result = modalReducer(stateWithModal, showModal({ type: ModalContentType.ImportDiagramModal, size: 'xl' }));

      expect(result.type).toBe(ModalContentType.ImportDiagramModal);
      expect(result.size).toBe('xl');
    });
  });

  describe('hideModal', () => {
    it('should set modal type to null when hiding', () => {
      const stateWithModal: ModalState = {
        type: ModalContentType.ShareModal,
        size: 'lg',
      };

      const result = modalReducer(stateWithModal, hideModal());

      expect(result.type).toBeNull();
    });

    it('should be idempotent when no modal is shown', () => {
      const result = modalReducer(initialState, hideModal());

      expect(result.type).toBeNull();
    });
  });
});

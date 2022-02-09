import { HideModalAction, ModalActionType, ShowModalAction } from './modal-types.js';
import { ModalContentType, ModalSize } from '../../components/modals/application-modal-types.js';

export const ModalRepository = {
  showModal: (type: ModalContentType, size: ModalSize = undefined): ShowModalAction => ({
    type: ModalActionType.SHOW_MODAL,
    payload: { type, size },
  }),
  hideModal: (): HideModalAction => ({
    type: ModalActionType.HIDE_MODAL,
  }),
};

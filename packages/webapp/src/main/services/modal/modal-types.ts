import { Action } from 'redux';
import { ModalContentType, ModalSize } from '../../components/modals/application-modal-types';

export type ModalState = {
  type: ModalContentType | null;
  size: ModalSize;
};

export type ModalActions = ShowModalAction | HideModalAction;

export const enum ModalActionType {
  SHOW_MODAL = '@@modal/show',
  HIDE_MODAL = '@@modal/hide',
}

export type ShowModalAction = Action<ModalActionType.SHOW_MODAL> & {
  payload: {
    type: ModalContentType;
    size: ModalSize;
  };
};
export type HideModalAction = Action<ModalActionType.HIDE_MODAL>;

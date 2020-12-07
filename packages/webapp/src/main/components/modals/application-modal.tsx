import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import { ModalContentType, ModalSize } from './application-modal-types';
import { ApplicationModalContent } from './application-modal-content';
import { ModalRepository } from '../../services/modal/modal-repository';

type OwnProps = {};
type State = {};

type StateProps = {
  displayModal?: ModalContentType | null;
  modalSize: ModalSize;
};

type DispatchProps = {
  close: typeof ModalRepository.hideModal;
};

type Props = StateProps & DispatchProps & OwnProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => {
    return { displayModal: state.modal.type, modalSize: state.modal.size };
  },
  {
    close: ModalRepository.hideModal,
  },
);

class ApplicationModalComponent extends Component<Props, State> {
  render() {
    if (!this.props.displayModal) {
      // Problem: when returned null the listeners are still kept at the document level to close the modal -> they hinder dropdowns to open
      // -> dropdowns: on show -> stopPropagation
      // if this is resolved at some point, the visibility management in menus can be removed
      return null;
    }

    const ModalContent = ApplicationModalContent[this.props.displayModal];

    return createPortal(
      <Modal
        id="application-modal"
        aria-labelledby="application-modal"
        size={this.props.modalSize}
        centered
        show
        onHide={this.props.close}
      >
        <ModalContent close={this.props.close} />
      </Modal>,
      document.body,
    );
  }
}

export const ApplicationModal = enhance(ApplicationModalComponent);

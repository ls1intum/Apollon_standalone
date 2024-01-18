import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import { ApplicationModalContent } from './application-modal-content';
import { ModalRepository } from '../../services/modal/modal-repository';

export const ApplicationModal = () => {
  const [isClosable, setIsClosable] = useState(true);
  const displayModal = useSelector((state: ApplicationState) => state.modal.type);
  const modalSize = useSelector((state: ApplicationState) => state.modal.size);
  const dispatch = useDispatch();

  const onClosableChange = (closable: boolean) => {
    setIsClosable(closable);
  };

  const handleClose = () => {
    if (isClosable) {
      dispatch(ModalRepository.hideModal());
    }
  };

  const closeModal = () => {
    dispatch(ModalRepository.hideModal());
  };

  if (!displayModal) {
    // Problem: when returned null the listeners are still kept at the document level to close the modal -> they hinder dropdowns to open
    // -> dropdowns: on show -> stopPropagation
    // if this is resolved at some point, the visibility management in menus can be removed
    return null;
  }

  const ModalContent = ApplicationModalContent[displayModal];

  return createPortal(
    <Modal
      id="application-modal"
      aria-labelledby="application-modal"
      size={modalSize}
      centered
      show
      onHide={handleClose}
    >
      <ModalContent close={closeModal} onClosableChange={onClosableChange} />
    </Modal>,
    document.body,
  );
};

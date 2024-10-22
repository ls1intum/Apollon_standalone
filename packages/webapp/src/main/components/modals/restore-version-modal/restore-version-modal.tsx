import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ModalContentProps } from '../application-modal-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectDiagram } from '../../../services/diagram/diagramSlice';
import { useAppSelector } from '../../store/hooks';

export const RestoreVersionModal: React.FC<ModalContentProps> = ({ close }) => {
  const diagram = useAppSelector(selectDiagram);

  const displayToast = () => {
    toast.success(`You have successfuly restored the diagram version ${diagram.title}`, {
      autoClose: 10000,
    });
  };

  const restoreVersion = () => {
    // TODO: Implement version restoring
    displayToast();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Restore Version</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="m-0">Are you sure you want to restore the version {diagram.title}?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={restoreVersion}>
          Restore
        </Button>
      </Modal.Footer>
    </>
  );
};

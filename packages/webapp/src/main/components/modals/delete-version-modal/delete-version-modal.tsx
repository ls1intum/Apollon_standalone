import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ModalContentProps } from '../application-modal-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../store/hooks';
import { selectDiagram } from '../../../services/diagram/diagramSlice';

export const DeleteVersionModal: React.FC<ModalContentProps> = ({ close }) => {
  const diagram = useAppSelector(selectDiagram);

  const displayToast = () => {
    toast.success(`You have successfuly deleted the diagram version ${diagram.title}`, {
      autoClose: 10000,
    });
  };

  const deleteVersion = () => {
    // TODO: Implement version deleting
    displayToast();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Delete Version</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="m-0">Are you sure you want to delete the version {diagram.title}? This change is irreversible.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="danger" onClick={deleteVersion}>
          Delete
        </Button>
      </Modal.Footer>
    </>
  );
};

import React from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { ModalContentProps } from '../application-modal-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../store/hooks';
import { selectDiagram } from '../../../services/diagram/diagramSlice';

export const EditVersionModal: React.FC<ModalContentProps> = ({ close }) => {
  const diagram = useAppSelector(selectDiagram);
  const displayToast = () => {
    toast.success(`You have successfuly edited the information of diagram version ${diagram.title}`, {
      autoClose: 10000,
    });
  };

  const editVersionInfo = () => {
    // TODO: Implement version deleting
    displayToast();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Edit Version Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <label htmlFor="diagram-title">Diagram Title</label>
          <InputGroup className="mt-1 mb-3">
            <FormControl id="diagram-title" value={diagram.title} />
          </InputGroup>
          <label htmlFor="diagram-description">Diagram Description</label>
          <InputGroup className="mt-1">
            <FormControl value={diagram.title} as={'textarea'} />
          </InputGroup>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={editVersionInfo}>
          Edit
        </Button>
      </Modal.Footer>
    </>
  );
};

import React from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { ModalContentProps } from '../application-modal-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../../store/hooks';
import { selectDiagram } from '../../../services/diagram/diagramSlice';

export const CreateVersionModal: React.FC<ModalContentProps> = ({ close }) => {
  const diagram = useAppSelector(selectDiagram);

  const displayToast = () => {
    toast.success(`You have successfuly a new version ${diagram.title}`, {
      autoClose: 10000,
    });
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create Version</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <label htmlFor="diagram-title">Diagram Title</label>
          <InputGroup className="mt-1 mb-3">
            <FormControl id="diagram-title" />
          </InputGroup>
          <label htmlFor="diagram-description">Diagram Description</label>
          <InputGroup className="mt-1">
            <FormControl as={'textarea'} />
          </InputGroup>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={displayToast}>
          Create
        </Button>
      </Modal.Footer>
    </>
  );
};

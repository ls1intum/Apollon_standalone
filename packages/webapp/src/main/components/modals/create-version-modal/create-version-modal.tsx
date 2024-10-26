import React, { useState } from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { ModalContentProps } from '../application-modal-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadDiagram,
  selectDiagram,
  setCreateNewEditor,
  updateDiagramThunk,
} from '../../../services/diagram/diagramSlice';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { displayError } from '../../../services/error-management/errorManagementSlice';
import { DiagramRepository } from '../../../services/diagram/diagram-repository';
import { useNavigate } from 'react-router-dom';

export const CreateVersionModal: React.FC<ModalContentProps> = ({ close }) => {
  const dispatch = useAppDispatch();
  const diagram = useAppSelector(selectDiagram);
  const [title, setTitle] = useState<string>(diagram.title);
  const [description, setDescription] = useState<string>(diagram.description || '');
  const navigate = useNavigate();

  const displayToast = () => {
    toast.success(`You have successfuly a new version ${diagram.title}`, {
      autoClose: 10000,
    });
  };

  const createNewVersion = () => {
    const token = LocalStorageRepository.getLastPublishedToken();

    if (token === null) {
      dispatch(displayError('Creation failed', 'An unexpected error occured while creating a new version'));
      close();

      return;
    }

    const diagramCopy = Object.assign({}, diagram);
    diagramCopy.title = title;
    diagramCopy.description = description;

    DiagramRepository.publishDiagramVersionOnServer(diagramCopy, token)
      .then((res) => {
        dispatch(loadDiagram(res.diagram));
        LocalStorageRepository.setLastPublishedToken(res.token);
        dispatch(setCreateNewEditor(true));
        navigate(`/${res.token}`);
      })
      .finally(() => {
        displayToast();
        close();
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
            <FormControl id="diagram-title" onChange={(e) => setTitle(e.target.value)} />
          </InputGroup>
          <label htmlFor="diagram-description">Diagram Description</label>
          <InputGroup className="mt-1">
            <FormControl id="diagram-description" onChange={(e) => setDescription(e.target.value)} as={'textarea'} />
          </InputGroup>
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={createNewVersion}>
          Create
        </Button>
      </Modal.Footer>
    </>
  );
};

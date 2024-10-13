import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { generateRandomName } from '../../../utils/random-name-generator/random-name-generator';
import { updateCollaborationColor, updateCollaborationName } from '../../../services/share/shareSlice';
import { ModalContentProps } from '../application-modal-types';

export const CollaborationModal: React.FC<ModalContentProps> = ({ close, onClosableChange }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(generateRandomName());
  const [color] = useState('#' + Math.floor(Math.random() * 16777215).toString(16));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  useEffect(() => {
    if (onClosableChange) {
      if (name.length > 1) {
        onClosableChange(true);
      } else {
        onClosableChange(false);
      }
    }
  }, [onClosableChange]);

  const setCollaborationNameAndColor = (e: MouseEvent<HTMLButtonElement>) => {
    LocalStorageRepository.setCollaborationName(name);
    LocalStorageRepository.setCollaborationColor(color);
    dispatch(updateCollaborationName(name));
    dispatch(updateCollaborationColor(color));
    close();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Collaboration Name</Modal.Title>
      </Modal.Header>
      <span className="ps-3">
        Please enter your name to highlight elements you are interacting with for other collaborators.
      </span>
      <Modal.Body>
        <>
          <InputGroup className="mb-3">
            <FormControl className="w-75" isInvalid={!name} placeholder={name} onChange={handleChange} autoFocus />
            <Button variant="outline-secondary" className="w-25" onClick={setCollaborationNameAndColor}>
              Confirm
            </Button>
          </InputGroup>
        </>
      </Modal.Body>
    </>
  );
};

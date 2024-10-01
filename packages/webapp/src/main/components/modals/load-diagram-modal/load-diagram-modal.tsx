import React from 'react';
import { Modal } from 'react-bootstrap';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types';
import { LoadDiagramContent } from './load-diagram-content';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { hideModal } from '../../../services/modal/modalSlice';
import { useLocalStorage } from '../../../services/local-storage/useLocalStorage';

export const LoadDiagramModal: React.FC = () => {
  const { diagram } = useAppSelector((state) => state.diagram);
  const dispatch = useAppDispatch();
  const loadDiagram  = useLocalStorage();

  const getSavedDiagrams = (): LocalStorageDiagramListItem[] => {
    const localDiagrams = LocalStorageRepository.getStoredDiagrams();
    return localDiagrams.filter((storedDiagram) => storedDiagram.id !== diagram?.id);
  };

  const onSelect = (id: string) => {
    loadDiagram(id);
    dispatch(hideModal());
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Load Diagram</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoadDiagramContent diagrams={getSavedDiagrams()} onSelect={onSelect} />
      </Modal.Body>
    </>
  );
};

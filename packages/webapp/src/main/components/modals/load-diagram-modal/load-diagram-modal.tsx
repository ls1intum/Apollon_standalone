import React, { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types';
import { LoadDiagramContent } from './load-diagram-content';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useLocalStorage } from '../../../services/local-storage/useLocalStorage';
import { ModalContentProps } from '../application-modal-types';
import { createDiagram, loadDiagram } from '../../../services/diagram/diagramSlice';
import { ApollonEditorContext } from '../../apollon-editor-component/apollon-editor-context';

export const LoadDiagramModal: React.FC<ModalContentProps> = ({ close }) => {
  const { diagram } = useAppSelector((state) => state.diagram);
  const dispatch = useAppDispatch();
  const fromlocalStorage = useLocalStorage();
  const editorContext = useContext(ApollonEditorContext);
  const getSavedDiagrams = (): LocalStorageDiagramListItem[] => {
    const localDiagrams = LocalStorageRepository.getStoredDiagrams();
    return localDiagrams.filter((storedDiagram) => storedDiagram.id !== diagram?.id);
  };

  const onSelect = (id: string) => {
    const loadedDiagram = fromlocalStorage(id);
    if (loadedDiagram && loadedDiagram.model && editorContext?.editor) {
      // editorContext.editor.model = loadedDiagram.model;
      dispatch(loadDiagram(loadedDiagram));
    }
    close();
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

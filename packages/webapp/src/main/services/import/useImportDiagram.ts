import { useCallback } from 'react';
import { useAppDispatch } from '../../components/store/hooks';
import { uuid } from '../../utils/uuid';
import { Diagram, updateDiagramThunk } from '../diagram/diagramSlice';
import { changeDiagramType } from '../editor-options/editorOptionSlice';
import { showModal } from '../modal/modalSlice';
import { displayError } from '../error-management/errorManagementSlice';

export const useImportDiagram = () => {
  const dispatch = useAppDispatch();

  const importDiagram = useCallback((stringifiedJson: string) => {
    try {
      const diagram: Diagram = JSON.parse(stringifiedJson);
      diagram.id = uuid();

      dispatch(updateDiagramThunk(diagram));
      if (diagram.model) {
        dispatch(changeDiagramType(diagram.model.type));
      }
    } catch {
      dispatch(
        displayError('Import failed', 'Could not import selected file. Are you sure it contains a diagram.json?'),
      );
    }
  }, []);

  return importDiagram;
};

import { useCallback } from 'react';
import { useAppDispatch } from '../../components/store/hooks';
import { uuid } from '../../utils/uuid';
import { Diagram, updateDiagram } from '../diagram/diagramSlice';
import { changeDiagramType } from '../editor-options/editorOptionSlice';

export const useImport = () => {
  const dispatch = useAppDispatch();

  const importDiagram = useCallback((stringifiedJson: string) => {
    const diagram: Diagram = JSON.parse(stringifiedJson);
    diagram.id = uuid();

    dispatch(updateDiagram(diagram));
    if (diagram.model) {
      dispatch(changeDiagramType(diagram.model.type));
    }
  }, []);

  return importDiagram;
};

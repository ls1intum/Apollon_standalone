import { useCallback } from 'react';
import moment from 'moment';
import { localStorageDiagramPrefix, localStorageDiagramsList, localStorageLatest } from '../../constant';
import { Diagram } from '../diagram/diagramSlice';

// Custom hook to handle local storage operations
export const useLocalStorage = () => {
  // Store diagram in local storage after update
  const storeDiagram = useCallback((diagram: Diagram) => {
    // Save diagram and update the latest diagram entry in local storage
    localStorage.setItem(localStorageDiagramPrefix + diagram.id, JSON.stringify(diagram));
    localStorage.setItem(localStorageLatest, diagram.id);

    // Create a new entry for the local storage diagram list
    const localDiagramEntry = {
      id: diagram.id,
      title: diagram.title,
      type: diagram.model?.type ?? 'UMLClassDiagram',
      lastUpdate: moment(),
    };

    // Get the list of diagrams from local storage
    const localStorageListJson = localStorage.getItem(localStorageDiagramsList);
    let localDiagrams = localStorageListJson ? JSON.parse(localStorageListJson) : [];

    // Filter out the old value and add the new one
    localDiagrams = localDiagrams.filter((entry: any) => entry.id !== diagram.id);
    localDiagrams.push(localDiagramEntry);

    // Save the updated diagram list in local storage
    localStorage.setItem(localStorageDiagramsList, JSON.stringify(localDiagrams));
  }, []);

  // Load a diagram from local storage
  const loadDiagram = useCallback((id: string): Diagram | null => {
    const localStorageContent = localStorage.getItem(localStorageDiagramPrefix + id);
    if (localStorageContent) {
      const diagram: Diagram = JSON.parse(localStorageContent);
      return diagram;
    } else {
      console.error(`The diagram with id ${id} could not be found in local storage.`);
      return null;
    }
  }, []);

  return {
    storeDiagram,
    loadDiagram,
  };
};

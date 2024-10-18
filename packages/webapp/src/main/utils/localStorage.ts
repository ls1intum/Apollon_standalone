import { localStorageDiagramPrefix, localStorageLatest } from '../constant';
import { Diagram } from '../services/diagram/diagramSlice';
import { uuid } from './uuid';

export const saveDiagramToLocalStorage = (diagram: Diagram) => {
  localStorage.setItem('latestDiagram', JSON.stringify(diagram));
};

export const getDiagramFromLocalStorage = (): Diagram | null => {
  const latestId: string | null = window.localStorage.getItem(localStorageLatest);

  let diagram: Diagram;

  if (latestId) {
    const latestDiagram: Diagram = JSON.parse(window.localStorage.getItem(localStorageDiagramPrefix + latestId)!);
    diagram = latestDiagram;
  } else {
    diagram = { id: uuid(), title: 'UMLClassDiagram', model: undefined, lastUpdate: new Date().toISOString() };
  }
  return diagram ?? null;
};

import { LocalStorageDiagramListItem } from './local-storage-types';
import {
  localStorageCollaborationColor,
  localStorageCollaborationName,
  localStorageDiagramPrefix,
  localStorageDiagramsList,
  localStorageLatest,
  localStorageSystemThemePreference,
  localStorageUserThemePreference,
} from '../../constant';
import { Diagram } from '../diagram/diagramSlice';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';

type LocalDiagramEntry = {
  id: string;
  title: string;
  type: UMLDiagramType;
  lastUpdate: string;
};

export const LocalStorageRepository = {
  storeDiagram: (diagram: Diagram) => {
    localStorage.setItem(localStorageDiagramPrefix + diagram.id, JSON.stringify(diagram));
    localStorage.setItem(localStorageLatest, diagram.id);

    const localDiagramEntry: LocalDiagramEntry = {
      id: diagram.id,
      title: diagram.title,
      type: diagram.model?.type ?? 'ClassDiagram',
      lastUpdate: new Date().toISOString(),
    };

    const localStorageListJson = localStorage.getItem(localStorageDiagramsList);
    let localDiagrams: LocalDiagramEntry[] = localStorageListJson ? JSON.parse(localStorageListJson) : [];

    localDiagrams = localDiagrams.filter((entry) => entry.id !== diagram.id);
    localDiagrams.push(localDiagramEntry);

    localStorage.setItem(localStorageDiagramsList, JSON.stringify(localDiagrams));
  },

  getStoredDiagrams: () => {
    const localStorageDiagramList = window.localStorage.getItem(localStorageDiagramsList);
    let localDiagrams: LocalStorageDiagramListItem[] = [];
    if (localStorageDiagramList) {
      localDiagrams = JSON.parse(localStorageDiagramList);
      localDiagrams.sort(
        (first: LocalStorageDiagramListItem, second: LocalStorageDiagramListItem) =>
          (new Date(first.lastUpdate).getTime() - new Date(second.lastUpdate).getTime()) * -1,
      );
    }
    return localDiagrams;
  },

  getCollaborationName: () => {
    const collaborationName: string = window.localStorage.getItem(localStorageCollaborationName) ?? '';
    return collaborationName;
  },

  setCollaborationName: (name: string) => {
    window.localStorage.setItem(localStorageCollaborationName, name);
  },

  setCollaborationColor: (color: string) => {
    window.localStorage.setItem(localStorageCollaborationColor, color);
  },

  setLastPublishedToken: (token: string) => {
    window.localStorage.setItem('last_published_token', token);
  },

  getLastPublishedToken: () => {
    return window.localStorage.getItem('last_published_token');
  },

  setLastPublishedType: (type: string) => {
    window.localStorage.setItem('last_published_type', type);
  },

  getLastPublishedType: () => {
    return window.localStorage.getItem('last_published_type');
  },

  setSystemThemePreference: (value: string) => {
    window.localStorage.setItem(localStorageSystemThemePreference, value);
  },

  setUserThemePreference: (value: string) => {
    window.localStorage.setItem(localStorageUserThemePreference, value);
  },

  getSystemThemePreference: () => {
    return window.localStorage.getItem(localStorageSystemThemePreference);
  },

  getUserThemePreference: () => {
    return window.localStorage.getItem(localStorageUserThemePreference);
  },

  removeUserThemePreference: () => {
    window.localStorage.removeItem(localStorageUserThemePreference);
  },
};

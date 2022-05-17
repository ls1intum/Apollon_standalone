import { LoadAction, LocalStorageActionTypes, LocalStorageDiagramListItem, StoreAction } from './local-storage-types';
import { Diagram } from '../diagram/diagram-types';
import {
  localStorageCollaborationName,
  localStorageDiagramsList,
  localStorageSystemThemePreference,
  localStorageUserThemePreference,
} from '../../constant';
import moment from 'moment';

export const LocalStorageRepository = {
  load: (id: string): LoadAction => ({
    type: LocalStorageActionTypes.LOAD,
    payload: {
      id,
    },
  }),

  store: (diagram: Diagram): StoreAction => ({
    type: LocalStorageActionTypes.STORE,
    payload: {
      diagram,
    },
  }),

  getStoredDiagrams: () => {
    const localStorageDiagramList = window.localStorage.getItem(localStorageDiagramsList);
    let localDiagrams: LocalStorageDiagramListItem[] = [];
    if (localStorageDiagramList) {
      localDiagrams = JSON.parse(localStorageDiagramList);
      // create full moment dates
      localDiagrams.forEach((diagram) => (diagram.lastUpdate = moment(diagram.lastUpdate)));
      // sort desc to lastUpdate -> * -1
      localDiagrams.sort(
        (first: LocalStorageDiagramListItem, second: LocalStorageDiagramListItem) =>
          (first.lastUpdate.valueOf() - second.lastUpdate.valueOf()) * -1,
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

import { Reducer } from 'redux';
import { UMLModel } from '@ls1intum/apollon';
import { Actions } from '../actions';
import { LocalStorageActionTypes, StorageStructure } from './local-storage-types';

export const LocalStorageReducer: Reducer<UMLModel | null, Actions> = (state, action) => {
  switch (action.type) {
    case LocalStorageActionTypes.LOAD: {
      const { payload } = action;

      const localSaved: StorageStructure = JSON.parse(window.localStorage.getItem('apollon')!);
      // TODO: handle loading errors, maybe put in local-storage-saga

      // find model
      const item = localSaved.models.find((item) => item.id === payload.id);

      return item ? (item.model as UMLModel) : null;
    }
    case LocalStorageActionTypes.STORE: {
      const { payload } = action;
      const { identifier, model, sequenceNumber } = payload;

      let localSaved: StorageStructure = JSON.parse(window.localStorage.getItem('apollon')!);
      if (!localSaved) localSaved = { sequence: 1, models: [], latest: undefined };
      if (!localSaved.models) localSaved.models = [];
      console.log(localSaved);
      localSaved.models.push({ id: identifier, model: model });
      localSaved.latest = identifier;
      if (sequenceNumber) localSaved.sequence = sequenceNumber;
      console.log(localSaved);
      localStorage.setItem('apollon', JSON.stringify(localSaved));
      console.log('stored');
      return state as UMLModel;
    }
  }

  return !state ? null : state;
};

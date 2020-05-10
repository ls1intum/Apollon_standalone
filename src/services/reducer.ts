import { Actions } from './actions';
import { ApplicationState } from '../components/store/application-state';
import { ReducersMapObject } from 'redux';
import { LocalStorageReducer } from './local-storage/local-storage-reducer';

export const reducers: ReducersMapObject<ApplicationState, Actions> = {
  diagram: LocalStorageReducer
};

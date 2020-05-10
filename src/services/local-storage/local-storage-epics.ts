import { LocalStorageActionTypes, StoreAction } from './local-storage-types';
import { ApplicationState } from '../../components/store/application-state';
import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { filter, map } from 'rxjs/operators';
import { localStorageDiagramPrefix, localStorageLatest } from '../../constant';
import { StopAction, StopActionType } from '../actions';

export const storeEpic: Epic<Action, StopAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.STORE),
    map((action) => action as StoreAction),
    map((action: StoreAction) => {
      let { id, title, model } = action.payload;
      let localSaved = {
        id,
        title,
        model: model,
      };
      localStorage.setItem(localStorageDiagramPrefix + localSaved.id, JSON.stringify(localSaved));
      localStorage.setItem(localStorageLatest, id);
      console.log('stored');
      return {
        type: StopActionType.STOP_ATION,
      };
    }),
  );
};

import { LocalStorageActions, LocalStorageActionTypes, StoreAction, ValidateStoreAction } from './local-storage-types';
import { ApplicationState } from '../../components/store/application-state';
import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { filter, map, tap } from 'rxjs/operators';
import { LocalStorageRepository } from './local-storage-repository';

export const identifierValidationEpic: Epic<Action, StoreAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === LocalStorageActionTypes.VALIDATE_STORE_ACTION),
    map((action) => action as ValidateStoreAction),
    map((action: ValidateStoreAction) => {
      let { identifier } = action.payload;
      if (!identifier) {
        const { model } = action.payload;
        // TODO: use id generator idSequence.next()
        identifier = `${model.type}-${store.value.idGenerator.next().value}`;
      }
      // check if current identifier already exists in savedState
      // if (this.savedState.models.some((model) => model.id == identifier)) {
      //   // TODO: give the user the option to override the current model or choose a new identifier
      // }

      const modifiedAction = { ...action };
      modifiedAction.payload.identifier = identifier;
      return modifiedAction;
    }),
    map((action: ValidateStoreAction) => LocalStorageRepository.store(action.payload.model, action.payload.identifier!)),
  );
};

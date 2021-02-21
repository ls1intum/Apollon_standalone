import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { filter, map } from 'rxjs/operators';
import { FileDownloadAction, FileDownloadActionTypes } from './file-download-types';
import { ApplicationState } from '../../components/store/application-state';
import { StopAction, StopActionType } from '../actions';

export const fileDownloadEpic: Epic<Action, StopAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === FileDownloadActionTypes.FILE_DOWNLOAD),
    map((action) => action as FileDownloadAction),
    map((action: FileDownloadAction) => {
      const file: File | Blob = action.payload.file;
      // TODO: find better way to download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      if (action.payload.filename) {
        link.download = action.payload.filename;
      } else if (file instanceof File) {
        link.download = file.name;
      } else {
        link.download = 'file';
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return {
        type: StopActionType.STOP_ACTION,
      };
    }),
  );
};

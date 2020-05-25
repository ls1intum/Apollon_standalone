import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { FileDownloadAction, FileDownloadActionTypes } from '../../file-download/file-download-types';
import { ApplicationState } from '../../../components/store/application-state';
import { filter, map } from 'rxjs/operators';
import { ExportActionTypes, ExportJSONAction } from '../export-types';
import { ApollonEditor } from '@ls1intum/apollon';
import { Diagram } from '../../local-storage/local-storage-types';

export const exportJSONEpic: Epic<Action, FileDownloadAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === ExportActionTypes.EXPORT_JSON),
    map((action) => action as ExportJSONAction),
    map((action: ExportJSONAction) => {
      const apollonEditor: ApollonEditor = action.payload.editor;
      const fileName: string = `${action.payload.diagram.title}.json`;
      const diagram: Diagram = { ...action.payload.diagram, model: apollonEditor.model };
      const apollonJSON: string = JSON.stringify(diagram);
      const fileToDownload = new File([apollonJSON], fileName);
      return {
        type: FileDownloadActionTypes.FILE_DOWNLOAD,
        payload: {
          file: fileToDownload,
        },
      };
    }),
  );
};

import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { ApplicationState } from '../../../components/store/application-state.js';
import { filter, map } from 'rxjs/operators';
import { ExportActionTypes } from '../export-types.js';
import { ExportSVGAction } from '../export-types.js';
import { ApollonEditor, SVG } from '@ls1intum/apollon';
import { FileDownloadAction, FileDownloadActionTypes } from '../../file-download/file-download-types.js';

export const exportSVGEpic: Epic<Action, FileDownloadAction, ApplicationState> = (action$, store) => {
  return action$.pipe(
    filter((action) => action.type === ExportActionTypes.EXPORT_SVG),
    map((action) => action as ExportSVGAction),
    map((action: ExportSVGAction) => {
      const apollonEditor: ApollonEditor = action.payload.editor;
      const fileName: string = `${action.payload.diagramTitle}.svg`;
      const apollonSVG: SVG = apollonEditor.exportAsSVG();
      const fileToDownload = new File([apollonSVG.svg], fileName);
      return {
        type: FileDownloadActionTypes.FILE_DOWNLOAD,
        payload: {
          file: fileToDownload,
        },
      };
    }),
  );
};

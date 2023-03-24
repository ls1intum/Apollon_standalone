import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { ApplicationState } from '../../../components/store/application-state';
import { filter, map, switchMap } from 'rxjs/operators';
import { ExportActionTypes } from '../export-types';
import { ExportSVGAction } from '../export-types';
import { ApollonEditor, SVG } from '@ls1intum/apollon';
import { FileDownloadAction, FileDownloadActionTypes } from '../../file-download/file-download-types';
import { Observable } from 'rxjs';

export const exportSVGEpic: Epic<Action, FileDownloadAction, ApplicationState> = (
  action$: Observable<Action<ExportActionTypes>>,
) => {
  return action$.pipe(
    filter((action) => action.type === ExportActionTypes.EXPORT_SVG),
    map((action) => action as ExportSVGAction),
    switchMap(async (action: ExportSVGAction) => {
      const apollonEditor: ApollonEditor = action.payload.editor;
      const fileName: string = `${action.payload.diagramTitle}.svg`;
      const apollonSVG: SVG = await apollonEditor.exportAsSVG();
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

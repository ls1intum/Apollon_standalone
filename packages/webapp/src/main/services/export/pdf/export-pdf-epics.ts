import { ApollonEditor, SVG } from '@ls1intum/apollon';
import { Action } from 'redux';
import { Epic, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApplicationState } from '../../../components/store/application-state';
import { StopAction, StopActionType } from '../../actions';
import { DiagramRepository } from '../../diagram/diagram-repository';
import { FileDownloadAction, FileDownloadActionTypes } from '../../file-download/file-download-types';
import { ExportActionTypes, ExportPDFAction } from '../export-types';

export const exportPDFEpic: Epic<Action, StopAction | FileDownloadAction, ApplicationState> = (
  action$: Observable<Action<ExportActionTypes>>,
) => {
  return action$.pipe(
    ofType(ExportActionTypes.EXPORT_PDF),
    map((action) => action as ExportPDFAction),
    switchMap(async (action: ExportPDFAction) => {
      const apollonEditor: ApollonEditor = action.payload.editor;
      const filename: string = `${action.payload.diagramTitle}.pdf`;
      const apollonSVG: SVG = await apollonEditor.exportAsSVG();
      const { width, height } = apollonSVG.clip;
      const blob = await DiagramRepository.convertSvgToPdf(apollonSVG.svg, width, height);

      if (blob) {
        const fileToDownload = new Blob([blob]);
        return {
          type: FileDownloadActionTypes.FILE_DOWNLOAD,
          payload: {
            file: fileToDownload,
            filename,
          },
        };
      }

      return {
        type: StopActionType.STOP_ACTION,
      };
    }),
  );
};

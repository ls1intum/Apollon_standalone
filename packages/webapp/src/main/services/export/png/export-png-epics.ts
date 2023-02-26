import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { ApplicationState } from '../../../components/store/application-state';
import { concatAll, filter, map } from 'rxjs/operators';
import { ExportActionTypes, ExportPNGAction } from '../export-types';
import { ApollonEditor, SVG } from '@ls1intum/apollon';
import { FileDownloadAction, FileDownloadActionTypes } from '../../file-download/file-download-types';
import { from, Observable } from 'rxjs';

export const exportPNGEpic: Epic<Action, FileDownloadAction, ApplicationState> = (
  action$: Observable<Action<ExportActionTypes>>,
) => {
  return action$.pipe(
    filter((action) => action.type === ExportActionTypes.EXPORT_PNG),
    map((action) => action as ExportPNGAction),
    map((action: ExportPNGAction) => {
      const apollonEditor: ApollonEditor = action.payload.editor;
      const fileName: string = `${action.payload.diagramTitle}.png`;
      const apollonSVG: SVG = apollonEditor.exportAsSVG();
      const setWhiteBackground: boolean = action.payload.setWhiteBackground;
      return from(
        convertRenderedSVGToPNG(apollonSVG, setWhiteBackground).then((png: Blob) => {
          const fileToDownload = new File([png], fileName);
          return {
            type: FileDownloadActionTypes.FILE_DOWNLOAD,
            payload: {
              file: fileToDownload,
            },
          };
        }),
      );
    }),
    concatAll(),
  );
};

export function convertRenderedSVGToPNG(renderedSVG: SVG, whiteBackground: boolean): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { width, height } = renderedSVG.clip;

    const blob = new Blob([renderedSVG.svg], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);

    const image = new Image();
    image.width = width;
    image.height = height;
    image.src = blobUrl;

    image.onload = () => {
      let canvas: HTMLCanvasElement;
      canvas = document.createElement('canvas');
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const scale = 1.5;
      canvas.width = width * scale;
      canvas.height = height * scale;

      const context = canvas.getContext('2d')!;

      if (whiteBackground) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.scale(scale, scale);
      context.drawImage(image, 0, 0);

      canvas.toBlob(resolve as BlobCallback);
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
}

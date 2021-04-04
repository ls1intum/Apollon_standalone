import { Action } from 'redux';

export const enum FileDownloadActionTypes {
  FILE_DOWNLOAD = '@@file/download',
}

export type FileDownloadAction = Action<FileDownloadActionTypes.FILE_DOWNLOAD> & {
  payload: {
    file: File | Blob;
    filename?: string;
  };
};

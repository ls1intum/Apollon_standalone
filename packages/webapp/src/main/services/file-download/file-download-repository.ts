import { FileDownloadAction, FileDownloadActionTypes } from './file-download-types.js';

export const FileDownloadRepository = {
  downloadFile: (file: File): FileDownloadAction => ({
    type: FileDownloadActionTypes.FILE_DOWNLOAD,
    payload: {
      file,
    },
  }),
};

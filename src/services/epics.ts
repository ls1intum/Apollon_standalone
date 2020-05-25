import { combineEpics } from 'redux-observable';
import { localStorageEpics } from './local-storage/local-storage-epics';
import exportEpics from './export/export-epics';
import { fileDownloadEpic } from './file-download/file-download-epics';
import { importEpic } from './import/import-epics';
import { updateDiagramEpic } from './diagram/diagram-epics';

const epics = combineEpics(localStorageEpics, exportEpics, fileDownloadEpic, importEpic, updateDiagramEpic);

export default epics;

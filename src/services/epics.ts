import { combineEpics } from 'redux-observable';
import { localStorageEpics } from './local-storage/local-storage-epics';
import exportEpics from './export/export-epics';
import { fileDownloadEpic } from './file-download/file-download-epics';
import { importEpic } from './import/import-epic';
import { diagramEpics } from './diagram/diagram-epics';

const epics = combineEpics(localStorageEpics, exportEpics, fileDownloadEpic, importEpic, diagramEpics);

export default epics;

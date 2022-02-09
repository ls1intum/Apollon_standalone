import { combineEpics } from 'redux-observable';
import { localStorageEpics } from './local-storage/local-storage-epics.js';
import exportEpics from './export/export-epics.js';
import { fileDownloadEpic } from './file-download/file-download-epics.js';
import { importEpic } from './import/import-epic.js';
import { diagramEpics } from './diagram/diagram-epics.js';

const epics = combineEpics(fileDownloadEpic, localStorageEpics, exportEpics, importEpic, diagramEpics);

export default epics;

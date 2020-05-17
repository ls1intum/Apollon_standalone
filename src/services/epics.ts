import { combineEpics } from 'redux-observable';
import { createDiagramEpic, loadDiagramEpic, storeEpic } from './local-storage/local-storage-epics';
import exportEpics from './export/export-epics';
import {fileDownloadEpic} from "./file-download/file-download-epics";

const epics = combineEpics(storeEpic, createDiagramEpic, loadDiagramEpic, exportEpics, fileDownloadEpic);

export default epics;

import { combineEpics } from 'redux-observable';
import { createDiagramEpic, loadDiagramEpic, storeEpic } from './local-storage/local-storage-epics';

const epics = combineEpics(storeEpic, createDiagramEpic, loadDiagramEpic);

export default epics;

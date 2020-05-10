import { combineEpics } from 'redux-observable';
import { storeEpic } from './local-storage/local-storage-epics';

const epics = combineEpics(storeEpic);

export default epics;

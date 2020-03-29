import { combineEpics } from 'redux-observable';
import { identifierValidationEpic } from './local-storage/local-storage-epics';

const epics = combineEpics(identifierValidationEpic);

export default epics;

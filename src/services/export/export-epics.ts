import { exportSVGEpic } from './svg/export-svg-epics';
import { combineEpics } from 'redux-observable';
import { exportPNGEpic } from './png/export-png-epics';

const exportEpics = combineEpics(exportSVGEpic, exportPNGEpic);

export default exportEpics;

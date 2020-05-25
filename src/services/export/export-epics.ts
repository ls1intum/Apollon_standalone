import { exportSVGEpic } from './svg/export-svg-epics';
import { combineEpics } from 'redux-observable';
import { exportPNGEpic } from './png/export-png-epics';
import { exportJSONEpic } from './json/export-json-epics';

const exportEpics = combineEpics(exportSVGEpic, exportPNGEpic, exportJSONEpic);

export default exportEpics;

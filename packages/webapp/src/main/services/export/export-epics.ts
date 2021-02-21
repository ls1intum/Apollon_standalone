import { exportSVGEpic } from './svg/export-svg-epics';
import { combineEpics } from 'redux-observable';
import { exportPNGEpic } from './png/export-png-epics';
import { exportJSONEpic } from './json/export-json-epics';
import { exportPDFEpic } from './pdf/export-pdf-epics';

const exportEpics = combineEpics(exportSVGEpic, exportPNGEpic, exportJSONEpic, exportPDFEpic);

export default exportEpics;

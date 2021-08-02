import { exportSVGEpic } from './svg/export-svg-epics';
import { combineEpics } from 'redux-observable';
import { exportPNGEpic } from './png/export-png-epics';
import { exportJSONEpic } from './json/export-json-epics';
import { exportPDFEpic } from './pdf/export-pdf-epics';

//TODO: Fix the types when library fixes it
const exportEpics = combineEpics(exportSVGEpic, exportPNGEpic, exportJSONEpic, exportPDFEpic) as any;

export default exportEpics;

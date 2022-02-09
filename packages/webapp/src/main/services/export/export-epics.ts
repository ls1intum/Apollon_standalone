import { exportSVGEpic } from './svg/export-svg-epics.js';
import { combineEpics } from 'redux-observable';
import { exportPNGEpic } from './png/export-png-epics.js';
import { exportJSONEpic } from './json/export-json-epics.js';
import { exportPDFEpic } from './pdf/export-pdf-epics.js';

// TODO: Fix the types when library fixes it
const exportEpics = combineEpics(exportSVGEpic, exportPNGEpic, exportJSONEpic, exportPDFEpic) as any;

export default exportEpics;

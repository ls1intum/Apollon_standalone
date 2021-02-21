import { Action } from 'redux';
import { ApollonEditor } from '@ls1intum/apollon';
import { Diagram } from '../diagram/diagram-types';

export const enum ExportActionTypes {
  EXPORT_SVG = '@@export/svg',
  EXPORT_PNG = '@@export/png',
  EXPORT_JSON = '@@export/json',
  EXPORT_PDF = '@@export/pdf',
}

export type ExportSVGAction = Action<ExportActionTypes.EXPORT_SVG> & {
  payload: {
    // needs reference to ApollonEditor to perform export
    editor: ApollonEditor;
    diagramTitle: string;
  };
};

export type ExportPNGAction = Action<ExportActionTypes.EXPORT_PNG> & {
  payload: {
    // needs reference to ApollonEditor to perform export
    editor: ApollonEditor;
    diagramTitle: string;
  };
};

export type ExportJSONAction = Action<ExportActionTypes.EXPORT_JSON> & {
  payload: {
    // needs reference to ApollonEditor to perform export
    editor: ApollonEditor;
    diagram: Diagram;
  };
};

export type ExportPDFAction = Action<ExportActionTypes.EXPORT_PDF> & {
  payload: {
    // needs reference to ApollonEditor to perform export
    editor: ApollonEditor;
    diagramTitle: string;
  };
};

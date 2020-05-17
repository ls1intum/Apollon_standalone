import { Action } from 'redux';
import { ApollonEditor } from '@ls1intum/apollon';

export const enum ExportActionTypes {
  EXPORT_SVG = '@@export/svg',
  Export_PNG = '@@export/png',
}

export type ExportSVGAction = Action<ExportActionTypes.EXPORT_SVG> & {
  payload: {
    // needs reference to ApollonEditor to perform export
    editor: ApollonEditor;
    diagramTitle: string;
  };
};

export type ExportPNGAction = Action<ExportActionTypes.Export_PNG> & {
  payload: {
    // needs reference to ApollonEditor to perform export
    editor: ApollonEditor;
    diagramTitle: string;
  };
};

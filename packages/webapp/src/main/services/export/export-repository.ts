import { ApollonEditor } from '@ls1intum/apollon';
import { ExportActionTypes, ExportJSONAction, ExportPDFAction, ExportPNGAction, ExportSVGAction } from './export-types';
import { Diagram } from '../diagram/diagram-types';

export const ExportRepository = {
  exportAsSVG: (editor: ApollonEditor, diagramTitle: string): ExportSVGAction => ({
    type: ExportActionTypes.EXPORT_SVG,
    payload: {
      editor,
      diagramTitle,
    },
  }),
  exportAsPNG: (editor: ApollonEditor, diagramTitle: string, setWhiteBackground: boolean): ExportPNGAction => ({
    type: ExportActionTypes.EXPORT_PNG,
    payload: {
      editor,
      diagramTitle,
      setWhiteBackground,
    },
  }),
  exportAsJSON: (editor: ApollonEditor, diagram: Diagram): ExportJSONAction => ({
    type: ExportActionTypes.EXPORT_JSON,
    payload: {
      editor,
      diagram,
    },
  }),
  exportAsPDF: (editor: ApollonEditor, diagramTitle: string): ExportPDFAction => ({
    type: ExportActionTypes.EXPORT_PDF,
    payload: {
      editor,
      diagramTitle,
    },
  }),
};

import { ApollonEditor } from '@ls1intum/apollon';
import {ExportActionTypes, ExportJSONAction, ExportPNGAction, ExportSVGAction} from './export-types';
import {Diagram} from "../local-storage/local-storage-types";

export const ExportRepository = {
  exportAsSVG: (editor: ApollonEditor, diagramTitle: string): ExportSVGAction => ({
    type: ExportActionTypes.EXPORT_SVG,
    payload: {
      editor: editor,
      diagramTitle: diagramTitle,
    },
  }),
  exportAsPNG: (editor: ApollonEditor, diagramTitle: string): ExportPNGAction => ({
    type: ExportActionTypes.EXPORT_PNG,
    payload: {
      editor: editor,
      diagramTitle: diagramTitle,
    },
  }),
  exportAsJSON: (editor: ApollonEditor, diagram: Diagram): ExportJSONAction => ({
    type: ExportActionTypes.EXPORT_JSON,
    payload: {
      editor: editor,
      diagram: diagram,
    },
  }),
};
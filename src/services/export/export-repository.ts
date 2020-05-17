import { ApollonEditor } from '@ls1intum/apollon';
import { ExportActionTypes, ExportPNGAction, ExportSVGAction } from './export-types';

export const ExportRepository = {
  exportAsSVG: (editor: ApollonEditor, diagramTitle: string): ExportSVGAction => ({
    type: ExportActionTypes.EXPORT_SVG,
    payload: {
      editor: editor,
      diagramTitle: diagramTitle,
    },
  }),
  exportAsPNG: (editor: ApollonEditor, diagramTitle: string): ExportPNGAction => ({
    type: ExportActionTypes.Export_PNG,
    payload: {
      editor: editor,
      diagramTitle: diagramTitle,
    },
  }),
};

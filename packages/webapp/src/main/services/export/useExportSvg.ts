import { useCallback } from 'react';
import { ApollonEditor, SVG } from '@ls1intum/apollon';
import { useFileDownload } from '../file-download/useFileDownload';


export const useExportSvg = () => {
  const downloadFile = useFileDownload();

  const exportSvg = useCallback(
    async (editor: ApollonEditor, diagramTitle: string) => {
      // Step 1: Export the diagram as SVG from the ApollonEditor
      const apollonSVG: SVG = await editor.exportAsSVG();

      // Step 2: Create a file name for the SVG
      const fileName = `${diagramTitle}.svg`;

      // Step 3: Create a Blob for the SVG and trigger file download
      const fileToDownload = new File([apollonSVG.svg], fileName, { type: 'image/svg+xml' });

      // Trigger the download using the useFileDownload hook
      downloadFile({ file: fileToDownload, filename: fileName });
    },
    [downloadFile]
  );

  return exportSvg;
};

import { useCallback } from 'react';
import { ApollonEditor } from '@ls1intum/apollon';
import { useFileDownload } from '../file-download/useFileDownload';
import { DiagramRepository } from '../diagram/diagram-repository';


export const useExportPdf = () => {
  const downloadFile = useFileDownload();

  const exportPdf = useCallback(
    async (editor: ApollonEditor, diagramTitle: string) => {
      // Step 1: Export the diagram as SVG from the ApollonEditor
      const apollonSVG = await editor.exportAsSVG();

      // Step 2: Extract the dimensions from the exported SVG
      const { width, height } = apollonSVG.clip;

      // Step 3: Convert the SVG to a PDF using the DiagramRepository method
      const pdfBlob = await DiagramRepository.convertSvgToPdf(apollonSVG.svg, width, height);

      if (pdfBlob) {
        // Step 4: Create a Blob and trigger file download
        const filename = `${diagramTitle}.pdf`;
        const fileToDownload = new Blob([pdfBlob], { type: 'application/pdf' });

        // Trigger the download using the useFileDownload hook
        downloadFile({ file: fileToDownload, filename });
      } else {
        console.error('Failed to convert SVG to PDF');
      }
    },
    [downloadFile]
  );

  return exportPdf;
};

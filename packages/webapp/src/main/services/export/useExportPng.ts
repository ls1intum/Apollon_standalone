import { useCallback } from 'react';
import { ApollonEditor, SVG } from '@ls1intum/apollon';
import { useFileDownload } from '../file-download/useFileDownload';

export const useExportPng = () => {
  const downloadFile = useFileDownload();

  const exportPng = useCallback(
    async (editor: ApollonEditor, diagramTitle: string, setWhiteBackground: boolean) => {
      // Step 1: Export the diagram as SVG from the ApollonEditor
      const apollonSVG: SVG = await editor.exportAsSVG();

      // Step 2: Convert the exported SVG to a PNG
      const pngBlob: Blob = await convertRenderedSVGToPNG(apollonSVG, setWhiteBackground);

      // Step 3: Create a file name for the PNG
      const fileName = `${diagramTitle}.png`;

      // Step 4: Create a Blob for the PNG and trigger file download
      const fileToDownload = new File([pngBlob], fileName, { type: 'image/png' });

      // Trigger the download using the useFileDownload hook
      downloadFile({ file: fileToDownload, filename: fileName });
    },
    [downloadFile]
  );

  return exportPng;
};

// Helper function to convert SVG to PNG
function convertRenderedSVGToPNG(renderedSVG: SVG, whiteBackground: boolean): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { width, height } = renderedSVG.clip;

    const blob = new Blob([renderedSVG.svg], { type: 'image/svg+xml' });
    const blobUrl = URL.createObjectURL(blob);

    const image = new Image();
    image.width = width;
    image.height = height;
    image.src = blobUrl;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 1.5;  // Adjust scale if necessary
      canvas.width = width * scale;
      canvas.height = height * scale;

      const context = canvas.getContext('2d')!;

      if (whiteBackground) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.scale(scale, scale);
      context.drawImage(image, 0, 0);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(blobUrl);  // Cleanup the blob URL
        resolve(blob as Blob);
      });
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
}

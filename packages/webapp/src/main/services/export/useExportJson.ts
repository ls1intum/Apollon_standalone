import { useCallback } from 'react';
import { ApollonEditor } from '@ls1intum/apollon';
import { useFileDownload } from '../file-download/useFileDownload';
import { Diagram } from '../diagram/diagramSlice';


export const useExportJson = () => {
  const downloadFile = useFileDownload();

  const exportJson = useCallback((editor: ApollonEditor, diagram: Diagram) => {
    // Prepare the file name
    const fileName = `${diagram.title}.json`;

    // Extract the model from the ApollonEditor and merge it with the diagram data
    const diagramData: Diagram = { ...diagram, model: editor.model };

    // Convert the diagram data to a JSON string
    const jsonContent = JSON.stringify(diagramData);

    // Create a Blob for the JSON content
    const fileToDownload = new File([jsonContent], fileName, { type: 'application/json' });

    // Trigger the file download using the useFileDownload hook
    downloadFile({ file: fileToDownload, filename: fileName });
  }, [downloadFile]);

  return exportJson;
};

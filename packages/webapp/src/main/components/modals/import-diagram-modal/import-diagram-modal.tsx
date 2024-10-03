import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ModalContentProps } from '../application-modal-types';
import { useAppDispatch } from '../../store/hooks';
import { useImportDiagram } from '../../../services/import/useImportDiagram';

export const ImportDiagramModal: React.FC<ModalContentProps> = ({ close }) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const dispatch = useAppDispatch();
  const importDiagram = useImportDiagram();

  const importDiagramHandler = () => {
    if (selectedFile) {
      new Promise((resolve: (value: string) => void, reject) => {
        if (selectedFile) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const target: any = event.target;
            const data = target.result;
            resolve(data);
          };
          reader.readAsText(selectedFile);
        } else {
          reject();
        }
      }).then((content: string) => {
        importDiagram(content);
      });
    }
    close();
  };

  const fileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file: File = event.target.files[0];
      setSelectedFile(file);
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Import Diagram</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          id="custom-file"
          placeholder={selectedFile?.name ? selectedFile.name : 'Please select a Apollon-Diagram.json to import'}
          type="file"
          // custom
          onChange={fileUpload}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={importDiagramHandler} disabled={!selectedFile}>
          Import Diagram
        </Button>
      </Modal.Footer>
    </>
  );
};

import React from 'react';
import { Button, Modal } from 'react-bootstrap';

import {
  apollonLibraryRepositoryLink,
  apollonLibraryVersion,
  apollonStandaloneRepositoryLink,
  appVersion,
} from '../../../application-constants';
import { ModalContentProps } from '../application-modal-types';

export const InformationModal: React.FC<ModalContentProps> = ({ close }) => {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Information about Apollon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td>Version:</td>
              <td>
                <a href={apollonStandaloneRepositoryLink} target="_blank">
                  Apollon Standalone{' '}
                </a>
                {appVersion}
              </td>
            </tr>
            <tr>
              <td>Apollon Library:</td>
              <td>
                <a href={apollonLibraryRepositoryLink} target="_blank">
                  Apollon library
                </a>{' '}
                {apollonLibraryVersion}
              </td>
            </tr>
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

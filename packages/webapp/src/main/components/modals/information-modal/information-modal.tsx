import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import {
  apollonLibraryRepositoryLink,
  apollonLibraryVersion,
  apollonStandaloneRepositoryLink,
  appVersion,
} from '../../../application-constants';
import { ModalContentProps } from '../application-modal-types';

type Props = {} & ModalContentProps;

type State = {
  selectedFile?: File;
};

const getInitialState = (): State => {
  return { selectedFile: undefined };
};

export class InformationModal extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose = () => {
    this.props.close();
    this.setState(getInitialState());
  };

  render() {
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
              <tr>
                <td>Branch:</td>
                <td>enhancement/upgrade-react-version</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

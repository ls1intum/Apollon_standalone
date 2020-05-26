import React, { ChangeEvent, Component, ComponentClass, ReactPortal } from 'react';
import { createPortal } from 'react-dom';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { ImportRepository } from '../../../services/import/import-repository';
import { LoadDiagramItem } from '../load-diagram-modal/load-diagram-item';
import {
  apollonLibraryRepositoryLink,
  apollonLibraryVersion,
  apollonStandaloneRepositoryLink,
  appVersion,
} from '../../../application-constants';

type Props = {
  show: boolean;
  close: () => void;
};

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

  render(): ReactPortal {
    const { show } = this.props;
    return createPortal(
      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Information about Apollon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td>Version:</td>
                <td>
                  <a href={apollonStandaloneRepositoryLink} target='_blank'>Apollon Standalone </a>
                  {appVersion}
                </td>
              </tr>
              <tr>
                <td>Apollon Library:</td>
                <td>
                  <a href={apollonLibraryRepositoryLink} target='_blank'>Apollon library</a> {apollonLibraryVersion}
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>,
      document.body,
    );
  }
}

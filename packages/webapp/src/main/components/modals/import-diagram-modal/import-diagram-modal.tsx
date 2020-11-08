import React, { ChangeEvent, Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { ImportRepository } from '../../../services/import/import-repository';
import { ModalContentProps } from '../application-modal-types';

type OwnProps = {} & ModalContentProps;

type State = {
  selectedFile?: File;
};

const getInitialState = (): State => {
  return { selectedFile: undefined };
};

type DispatchProps = {
  importDiagram: typeof ImportRepository.importJSON;
};

type StateProps = {};

type Props = StateProps & DispatchProps & OwnProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(null, {
  importDiagram: ImportRepository.importJSON,
});

class ImportDiagramModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.importDiagram = this.importDiagram.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  handleClose = () => {
    this.props.close();
    this.setState(getInitialState());
  };

  importDiagram() {
    if (this.state.selectedFile) {
      new Promise((resolve: (value: string) => void, reject) => {
        if (this.state.selectedFile) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const target: any = event.target;
            const data = target.result;
            resolve(data);
          };
          reader.readAsText(this.state.selectedFile);
        } else {
          reject();
        }
      }).then((content: string) => {
        this.props.importDiagram(content);
      });
    }
    this.handleClose();
  }

  fileUpload(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.[0]) {
      const file: File = event.target.files[0];
      this.setState({ selectedFile: file });
    }
  }

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Import Diagram</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.File
              id="custom-file"
              label={
                this.state.selectedFile?.name
                  ? this.state.selectedFile.name
                  : 'Please select a Apollon-Diagram.json to import'
              }
              custom
              onChange={this.fileUpload}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.importDiagram} disabled={!this.state.selectedFile}>
            Import Diagram
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export const ImportDiagramModal = enhance(ImportDiagramModalComponent);

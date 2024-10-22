import React, { Component } from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { Diagram } from '../../../services/diagram/diagram-types';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { ErrorRepository } from '../../../services/error-management/error-repository';
import { ModalContentProps } from '../application-modal-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type OwnProps = {} & ModalContentProps;

type StateProps = {
  diagram: Diagram | null;
};

type DispatchProps = {
  createError: typeof ErrorRepository.createError;
};

type Props = OwnProps & StateProps & DispatchProps;

// TODO: Add deleteVersion function from Version/DiagramRepository
const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => {
    return {
      diagram: state.diagram,
    };
  },
  { createError: ErrorRepository.createError },
);

const getInitialState = () => {
  return {};
};

type State = typeof getInitialState;

class CreateVersionModalComponent extends Component<Props, State> {
  state = getInitialState();

  handleClose = () => {
    this.props.close();
  };

  displayToast = () => {
    toast.success(`You have successfuly a new version ${this.props.diagram?.title}`, {
      autoClose: 10000,
    });
  };

  createVersion = () => {
    // TODO: Implement version deleting
    this.displayToast();
  };

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Create Version</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <label htmlFor="diagram-title">Diagram Title</label>
            <InputGroup className="mt-1 mb-3">
              <FormControl id="diagram-title" />
            </InputGroup>
            <label htmlFor="diagram-description">Diagram Description</label>
            <InputGroup className="mt-1">
              <FormControl as={'textarea'} />
            </InputGroup>
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.createVersion}>
            Create
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export const CreateVersionModal = enhance(CreateVersionModalComponent);

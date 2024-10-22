import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
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

class DeleteVersionModalComponent extends Component<Props, State> {
  state = getInitialState();

  handleClose = () => {
    this.props.close();
  };

  displayToast = () => {
    toast.success(`You have successfuly deleted the diagram version ${this.props.diagram?.title}`, {
      autoClose: 10000,
    });
  };

  deleteVersion = () => {
    // TODO: Implement version deleting
    this.displayToast();
  };

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Delete Version</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="m-0">
            Are you sure you want to delete the version {this.props.diagram?.title}? This change is irreversible.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={this.deleteVersion}>
            Delete
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export const DeleteVersionModal = enhance(DeleteVersionModalComponent);

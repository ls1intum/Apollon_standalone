import React, { ChangeEvent, Component, MouseEvent } from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ErrorRepository } from '../../../services/error-management/error-repository';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { ShareRepository } from '../../../services/share/share-repository';
import { ApplicationState } from '../../store/application-state';
import { ModalContentProps } from '../application-modal-types';

type OwnProps = {} & ModalContentProps;

type StateProps = {
  collaborationName: string;
};

type DispatchProps = {
  createError: typeof ErrorRepository.createError;
  updateCollaborationName: typeof ShareRepository.updateCollaborationName;
};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => {
    return {
      collaborationName: state.share.collaborationName,
    };
  },
  { createError: ErrorRepository.createError, updateCollaborationName: ShareRepository.updateCollaborationName },
);

const getInitialState = () => {
  return {
    name: '',
  };
};

type State = typeof getInitialState;

class CollaborationModalComponent extends Component<Props, State> {
  state = getInitialState();

  componentDidMount() {
    const collaborationName = this.props.collaborationName;
    if (!collaborationName) {
      this.props.onClosableChange?.(false);
    } else {
      this.setState({ name: collaborationName });
    }
  }

  handleClose = () => {
    if (this.state.name) {
      this.props.close();
      this.setState(getInitialState());
    }
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: e.currentTarget.value,
    });
  };

  setCollaborationName = (e: MouseEvent<HTMLButtonElement>) => {
    LocalStorageRepository.setCollaborationName(this.state.name);
    this.props.updateCollaborationName(this.state.name);
    this.props.close();
  };

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Collaboration Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <InputGroup className="mb-3">
              <FormControl isInvalid={!this.state.name} value={this.state.name} onChange={this.handleChange} />
              <InputGroup.Append className="w-25">
                <Button variant="outline-secondary" className="w-100" onClick={this.setCollaborationName}>
                  Confirm
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </>
        </Modal.Body>
      </>
    );
  }
}

export const CollaborationModal = enhance(CollaborationModalComponent);

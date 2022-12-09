import React, { ChangeEvent, Component, MouseEvent } from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ErrorRepository } from '../../../services/error-management/error-repository';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { ShareRepository } from '../../../services/share/share-repository';
import { generateRandomName } from '../../../utils/random-name-generator/random-name-generator';
import { ApplicationState } from '../../store/application-state';
import { ModalContentProps } from '../application-modal-types';

type OwnProps = {} & ModalContentProps;

type StateProps = {
  collaborationName: string;
};

type DispatchProps = {
  createError: typeof ErrorRepository.createError;
  updateCollaborationName: typeof ShareRepository.updateCollaborationName;
  updateCollaborationColor: typeof ShareRepository.updateCollaborationColor;
};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => {
    return {
      collaborationName: state.share.collaborationName,
      collaborationColor: state.share.collaborationColor,
    };
  },
  {
    createError: ErrorRepository.createError,
    updateCollaborationName: ShareRepository.updateCollaborationName,
    updateCollaborationColor: ShareRepository.updateCollaborationColor,
  },
);

const getInitialState = () => {
  return {
    name: generateRandomName(),
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
  };
};

type State = typeof getInitialState;

class CollaborationModalComponent extends Component<Props, State> {
  innerRef: React.RefObject<HTMLInputElement>;
  constructor(props: Props) {
    super(props);
    this.innerRef = React.createRef();
  }
  state = getInitialState();

  componentDidMount() {
    const collaborationName = this.props.collaborationName;
    if (!collaborationName) {
      this.props.onClosableChange?.(false);
    } else {
      this.setState({ name: collaborationName });
    }
    setTimeout(() => {
      this.innerRef.current?.focus();
    }, 1);
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

  setCollaborationNameAndColor = (e: MouseEvent<HTMLButtonElement>) => {
    LocalStorageRepository.setCollaborationName(this.state.name);
    LocalStorageRepository.setCollaborationColor(this.state.color);
    this.props.updateCollaborationName(this.state.name);
    this.props.updateCollaborationColor(this.state.color);
    this.props.close();
  };

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Collaboration Name</Modal.Title>
        </Modal.Header>
        <span className="ps-3">
          Please enter your name to highlight elements you are interacting with for other collaborators.
        </span>
        <Modal.Body>
          <>
            <InputGroup className="mb-3">
              <FormControl
                className="w-75"
                isInvalid={!this.state.name}
                placeholder={this.state.name}
                onChange={this.handleChange}
                ref={this.innerRef}
              />
              <Button variant="outline-secondary" className="w-25" onClick={this.setCollaborationNameAndColor}>
                Confirm
              </Button>
            </InputGroup>
          </>
        </Modal.Body>
      </>
    );
  }
}

export const CollaborationModal = enhance(CollaborationModalComponent);

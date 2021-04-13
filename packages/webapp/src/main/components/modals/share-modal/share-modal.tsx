import React, { Component } from 'react';
import { Button, Dropdown, DropdownButton, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { Diagram } from '../../../services/diagram/diagram-types';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { DiagramRepository } from '../../../services/diagram/diagram-repository';
import { DEPLOYMENT_URL } from '../../../constant';
import { DiagramView } from 'shared/src/main/diagram-view';
import { ErrorRepository } from '../../../services/error-management/error-repository';
import { ErrorActionType } from '../../../services/error-management/error-types';
import { ModalContentProps } from '../application-modal-types';

type OwnProps = {} & ModalContentProps;

type StateProps = {
  diagram: Diagram | null;
};

type DispatchProps = {
  createError: typeof ErrorRepository.createError;
};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => {
    return {
      diagram: state.diagram,
    };
  },
  { createError: ErrorRepository.createError },
);

const getInitialState = () => {
  return {
    view: DiagramView.EDIT,
    token: '',
  };
};

type State = typeof getInitialState;

const getDisplayValueForView = (view: DiagramView) => {
  switch (view) {
    case DiagramView.EDIT:
      return 'Edit';
    case DiagramView.GIVE_FEEDBACK:
      return 'Give Feedback';
    case DiagramView.SEE_FEEDBACK:
      return 'See Feedback';
    case DiagramView.COLLABORATE:
      return 'Collaborate';
  }
};

class ShareModalComponent extends Component<Props, State> {
  state = getInitialState();

  getLinkForView = (view: DiagramView) => {
    if (!this.state.token) {
      return 'The diagram must be published';
    } else {
      return `${DEPLOYMENT_URL}/${this.state.token}?view=${view}`;
    }
  };

  getMessageForView = () => {
    let innerMessage = 'edit';
    switch (this.state.view) {
      case DiagramView.GIVE_FEEDBACK:
        innerMessage = 'give feedback';
        break;
      case DiagramView.SEE_FEEDBACK:
        innerMessage = 'see feedback';
        break;
      case DiagramView.COLLABORATE:
        innerMessage = 'collaborate';
        break;
    }
    return `Everyone with this link receives a copy of this diagram to ${innerMessage}`;
  };

  changePermission = (view: DiagramView) => {
    this.setState({ view });
  };

  copyLink = () => {
    const link = this.getLinkForView(this.state.view);
    navigator.clipboard.writeText(link);
    if (this.state.view === DiagramView.COLLABORATE) {
      window.open(link);
    }
  };

  handleClose = () => {
    this.props.close();
    this.setState(getInitialState());
  };

  publishDiagram = () => {
    if (this.props.diagram) {
      DiagramRepository.publishDiagramOnServer(this.props.diagram)
        .then((token: string) => {
          this.setState({ token });
        })
        .catch((error) => {
          this.props.createError(
            ErrorActionType.DISPLAY_ERROR,
            'Connection failed',
            'Connection to the server failed. Please try again or report a problem.',
          );
          this.handleClose();
          console.error(error);
        });
    }
  };

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <p>
              If you want to share the current version of your diagram with other users, click on the publish button. A
              copy of your current diagram version is then stored on the server so that other users can access it. It
              will be accessible for 12 weeks with the correct link. The links are shown after you clicked on the
              publish button.
            </p>
            <InputGroup className="mb-3">
              <FormControl readOnly value={this.getMessageForView()} bsCustomPrefix="w-100" />
              <DropdownButton
                id="permission-selection-dropdown"
                title={getDisplayValueForView(this.state.view)}
                as={InputGroup.Append}
                variant="outline-secondary"
                className="w-25"
              >
                {Object.values(DiagramView).map((value) => (
                  <Dropdown.Item key={value} onSelect={(eventKey) => this.changePermission(value)}>
                    {getDisplayValueForView(value)}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl readOnly value={this.getLinkForView(this.state.view)} />
              <InputGroup.Append className="w-25">
                {this.state.token ? (
                  <Button variant="outline-secondary" className="w-100" onClick={(event) => this.copyLink()}>
                    Copy Link
                  </Button>
                ) : (
                  <Button variant="outline-secondary" className="w-100" onClick={(event) => this.publishDiagram()}>
                    Get Link
                  </Button>
                )}
              </InputGroup.Append>
            </InputGroup>
          </>
        </Modal.Body>
      </>
    );
  }
}

export const ShareModal = enhance(ShareModalComponent);

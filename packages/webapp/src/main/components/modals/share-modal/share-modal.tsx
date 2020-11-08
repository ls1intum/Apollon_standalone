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
import { ModalRepository } from '../../../services/modal/modal-repository';
import { ModalContentProps } from '../application-modal-types';

type OwnProps = {} & ModalContentProps;

type StateProps = {
  diagram: Diagram;
};

type DispatchProps = {
  createError: typeof ErrorRepository.createError;
  closeModal: typeof ModalRepository.hideModal;
};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => {
    return {
      diagram: state.diagram,
    };
  },
  { createError: ErrorRepository.createError, closeModal: ModalRepository.hideModal },
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
  }
};

class ShareModalComponent extends Component<Props, State> {
  state = getInitialState();

  getLinkForView = (view: DiagramView) => {
    if (!this.state.token) {
      return '';
    } else {
      return `${DEPLOYMENT_URL}/${this.state.token}?view=${view}`;
    }
  };

  changePermission = (view: DiagramView) => {
    this.setState({ view });
  };

  copyLink = () => {
    const link = this.getLinkForView(this.state.view);
    navigator.clipboard.writeText(link);
  };

  publishDiagram = () => {
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
        this.props.closeModal();
        console.error(error);
      });
  };

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.token ? (
            <>
              <InputGroup className="mb-3">
                <FormControl
                  readOnly
                  value={`Everyone with this link can ${
                    this.state.view === DiagramView.EDIT ? 'edit' : 'give feedback to'
                  } this diagram`}
                  bsCustomPrefix="w-100"
                />
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
                  <Button variant="outline-secondary" className="w-100" onClick={(event) => this.copyLink()}>
                    Copy Link
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </>
          ) : (
            <>
              <p>
                If you want to share the current version of your diagram with other users, click on the publish button.
                A copy of your current diagram version is then stored on the server so that other users can access it.
                It will be accessible for 12 weeks with the correct link. The links are shown after you clicked on the
                publish button.
              </p>
              <Button variant="outline-primary" onClick={(event) => this.publishDiagram()}>
                Publish
              </Button>
            </>
          )}
        </Modal.Body>
      </>
    );
  }
}

export const ShareModal = enhance(ShareModalComponent);

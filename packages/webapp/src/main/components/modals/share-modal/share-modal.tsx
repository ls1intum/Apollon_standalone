import React, { Component } from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { Diagram } from '../../../services/diagram/diagram-types';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { DiagramRepository } from '../../../services/diagram/diagram-repository';
import { DEPLOYMENT_URL } from '../../../constant';
import { DiagramView } from 'shared/src/main/diagram-view';
import { ErrorRepository } from '../../../services/error-management/error-repository';
import { ErrorActionType } from '../../../services/error-management/error-types';
import { ModalContentProps } from '../application-modal-types';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
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

class ShareModalComponent extends Component<Props, State> {
  state = getInitialState();

  getLinkForView = () => {
    return `${DEPLOYMENT_URL}/${LocalStorageRepository.getLastPublishedToken()}?view=${LocalStorageRepository.getLastPublishedType()}`;
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
    return `You can now share simply by pasting the link, to ${innerMessage} the current diagram`;
  };

  shareDiagram = (view: DiagramView) => {
    this.setState({ view }, () => {
      this.publishDiagram();
    });
  };

  copyLink = () => {
    const link = this.getLinkForView();
    navigator.clipboard.writeText(link);
    this.displayToasts();
  };

  handleClose = () => {
    this.props.close();
  };

  publishDiagram = () => {
    if (this.props.diagram) {
      DiagramRepository.publishDiagramOnServer(this.props.diagram)
        .then((token: string) => {
          this.setState({ token }, () => {
            LocalStorageRepository.setLastPublishedToken(token);
            LocalStorageRepository.setLastPublishedType(this.state.view);
            this.copyLink();
            this.handleClose();
          });
        })
        .catch((error) => {
          this.props.createError(
            ErrorActionType.DISPLAY_ERROR,
            'Connection failed',
            'Connection to the server failed. Please try again or report a problem.',
          );
          this.handleClose();
          // tslint:disable-next-line:no-console
          console.error(error);
        });
    }
  };

  hasRecentlyPublished = () => {
    const lastPublishedToken = LocalStorageRepository.getLastPublishedToken();
    if (lastPublishedToken) return true;
  };

  displayToasts = () => {
    toast.success('Link is now copied to your clipboard.');
    toast.info(this.getMessageForView());
    toast.info('You can access the link again by going to share menu', { delay: 6500 });
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
              If you want to share the current version of your diagram with other users, click on the available sharing
              options. A copy of your current diagram version is then stored on the server so that other users can
              access it. It will be accessible for 12 weeks with the correct link.
            </p>

            <div className="container">
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-3 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      this.shareDiagram(DiagramView.EDIT);
                    }}
                    className="btn btn-outline-secondary w-100"
                  >
                    Edit
                  </button>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      this.shareDiagram(DiagramView.GIVE_FEEDBACK);
                    }}
                    className="btn btn-outline-secondary  w-100"
                  >
                    Give Feedback
                  </button>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      this.shareDiagram(DiagramView.SEE_FEEDBACK);
                    }}
                    className="btn btn-outline-secondary  w-100"
                  >
                    See Feedback
                  </button>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-3 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      this.shareDiagram(DiagramView.COLLABORATE);
                    }}
                    className="btn btn-outline-secondary w-100"
                  >
                    Collaborate
                  </button>
                </div>
              </div>
            </div>

            {this.hasRecentlyPublished() && (
              <fieldset className="scheduler-border">
                <legend className="scheduler-border">Recently shared Diagram:</legend>
                <InputGroup>
                  {!this.state.token ? (
                    <FormControl readOnly value={this.getLinkForView()} />
                  ) : (
                    <a className="w-75" target="blank" href={this.getLinkForView()}>
                      <FormControl
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        readOnly
                        value={this.getLinkForView()}
                      />
                    </a>
                  )}
                  <InputGroup.Append>
                    <Button variant="outline-secondary" className="w-100" onClick={() => this.copyLink()}>
                      Copy Link
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </fieldset>
            )}
          </>
        </Modal.Body>
      </>
    );
  }
}

export const ShareModal = enhance(ShareModalComponent);

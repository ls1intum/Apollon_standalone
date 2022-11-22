import React, { Component } from 'react';
import { Button, FormControl, InputGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
    return `${innerMessage}`;
  };

  shareDiagram = (view: DiagramView) => {
    this.setState({ view }, () => {
      this.publishDiagram();
    });
  };

  copyLink = (displayToast = false) => {
    const link = this.getLinkForView();
    navigator.clipboard.writeText(link);
    if (displayToast) this.displayToast();
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
            if (this.state.view === 'COLLABORATE') {
              window.location.href = this.getLinkForView() + '&notifyUser=true';
            }
            this.copyLink(true);
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
    return !!lastPublishedToken;
  };

  displayToast = () => {
    toast.success(
      'The link has been copied to your clipboard and can be shared to ' +
        this.getMessageForView() +
        ', simply by pasting the link. You can re-access the link by going to share menu.',
      {
        autoClose: 10000,
      },
    );
  };

  render() {
    return (
      <>
        <Modal.Header>
          <Modal.Title>Share</Modal.Title>
          <button onClick={this.props.close} type="button" className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <>
            <p>
              After sharing, this diagram will be accessible to everyone with access to the link for at least 12
              weeks.&nbsp;
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="share-tooltip">Changing the diagram will extend the time period.</Tooltip>}
              >
                <span className="tooltip-icon">
                  <i className="bi bi-info-circle" />
                </span>
              </OverlayTrigger>
            </p>

            <div className="container mb-3">
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
                <legend className="scheduler-border float-none w-auto">Recently shared Diagram:</legend>
                <InputGroup>
                  {!this.state.token ? (
                    <FormControl readOnly value={this.getLinkForView()} />
                  ) : (
                    <a target="blank" href={this.getLinkForView()}>
                      <FormControl
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        readOnly
                        value={this.getLinkForView()}
                      />
                    </a>
                  )}
                  <Button variant="outline-secondary" onClick={() => this.copyLink(true)}>
                    Copy Link
                  </Button>
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

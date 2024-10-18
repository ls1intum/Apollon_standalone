import React from 'react';
import { Button, FormControl, InputGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DiagramRepository } from '../../../services/diagram/diagram-repository';
import { DEPLOYMENT_URL } from '../../../constant';
import { DiagramView } from 'shared/src/main/diagram-view';
import { ModalContentProps } from '../application-modal-types';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InfoCircle } from 'react-bootstrap-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { displayError } from '../../../services/error-management/errorManagementSlice';
import { useNavigate } from 'react-router-dom';
import { setCreateNewEditor } from '../../../services/diagram/diagramSlice';

export const ShareModal: React.FC<ModalContentProps> = ({ close }) => {
  const dispatch = useAppDispatch();
  const diagram = useAppSelector((state) => state.diagram.diagram);
  const navigate = useNavigate();
  const urlPath = window.location.pathname;
  const tokenInUrl = urlPath.substring(1); // This removes the leading "/"

  const getLinkForView = () => {
    return `${DEPLOYMENT_URL}/${LocalStorageRepository.getLastPublishedToken()}?view=${LocalStorageRepository.getLastPublishedType()}`;
  };

  const getMessageForView = (view: DiagramView) => {
    switch (view) {
      case DiagramView.GIVE_FEEDBACK:
        return 'give feedback';

      case DiagramView.SEE_FEEDBACK:
        return 'see feedback';

      case DiagramView.COLLABORATE:
        return 'collaborate';
    }
    return 'edit';
  };

  const copyLink = (view: DiagramView, token?: string) => {
    if (token) {
      navigate(`/${token}?view=${view}`);
    }
    dispatch(setCreateNewEditor(true));
    toast.success(
      'The link has been copied to your clipboard and can be shared to ' +
        getMessageForView(view) +
        ', simply by pasting the link. You can re-access the link by going to share menu.',
      {
        autoClose: 10000,
      },
    );
  };

  const handleShareButtonPress = (view: DiagramView) => {
    if (tokenInUrl) {
      navigate(`/${tokenInUrl}?view=${view}`);
      close();
    } else {
      publishDiagram(view);
    }
  };

  const publishDiagram = (view: DiagramView) => {
    if (diagram && diagram.model && Object.keys(diagram.model.elements).length > 0) {
      DiagramRepository.publishDiagramOnServer(diagram)
        .then((token: string) => {
          LocalStorageRepository.setLastPublishedToken(token);
          LocalStorageRepository.setLastPublishedType(view);
          copyLink(view, token);
          close();
        })
        .catch((error) => {
          dispatch(
            displayError('Connection failed', 'Connection to the server failed. Please try again or report a problem.'),
          );
          close();
          // tslint:disable-next-line:no-console
          console.error(error);
        });
    } else {
      dispatch(
        displayError(
          'Sharing diagram failed',
          'You are trying to share an empty diagram. Please insert at least one element to the canvas before sharing.',
        ),
      );
      close();
    }
  };

  const hasRecentlyPublished = () => {
    const lastPublishedToken = LocalStorageRepository.getLastPublishedToken();
    return !!lastPublishedToken;
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Share</Modal.Title>
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
                <InfoCircle />
              </span>
            </OverlayTrigger>
          </p>

          <div className="container mb-3">
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-3 p-1">
                <button
                  type="button"
                  onClick={() => {
                    handleShareButtonPress(DiagramView.EDIT);
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
                    handleShareButtonPress(DiagramView.GIVE_FEEDBACK);
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
                    handleShareButtonPress(DiagramView.SEE_FEEDBACK);
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
                    handleShareButtonPress(DiagramView.COLLABORATE);
                  }}
                  className="btn btn-outline-secondary w-100"
                >
                  Collaborate
                </button>
              </div>
            </div>
          </div>

          {hasRecentlyPublished() && (
            <fieldset className="scheduler-border">
              <legend className="scheduler-border float-none w-auto">Recently shared Diagram:</legend>
              <InputGroup>
                {!tokenInUrl ? (
                  <FormControl readOnly value={getLinkForView()} />
                ) : (
                  <a target="blank" href={getLinkForView()}>
                    <FormControl
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      readOnly
                      value={getLinkForView()}
                    />
                  </a>
                )}
                <Button
                  variant="outline-secondary"
                  onClick={() => copyLink(LocalStorageRepository.getLastPublishedType() as DiagramView, tokenInUrl)}
                >
                  Copy Link
                </Button>
              </InputGroup>
            </fieldset>
          )}
        </>
      </Modal.Body>
    </>
  );
};

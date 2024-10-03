import React, { useState } from 'react';
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

export const ShareModal: React.FC<ModalContentProps> = ({ close }) => {
  const [view, setView] = useState<DiagramView>(DiagramView.EDIT);
  const [token, setToken] = useState('');
  const dispatch = useAppDispatch();
  const diagram = useAppSelector((state) => state.diagram.diagram);

  const getLinkForView = () => {
    return `${DEPLOYMENT_URL}/${LocalStorageRepository.getLastPublishedToken()}?view=${LocalStorageRepository.getLastPublishedType()}`;
  };

  const getMessageForView = () => {
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

  const shareDiagram = (view: DiagramView) => {
    setView(view);
    publishDiagram();
  };

  const copyLink = (showToast = false) => {
    const link = getLinkForView();
    navigator.clipboard.writeText(link);
    if (showToast) {
      displayToast();
    }
  };

  const publishDiagram = () => {
    if (diagram && diagram.model && Object.keys(diagram.model.elements).length > 0) {
      DiagramRepository.publishDiagramOnServer(diagram)
        .then((token: string) => {
          setToken(token);
          LocalStorageRepository.setLastPublishedToken(token);
          LocalStorageRepository.setLastPublishedType(view);
          if (view === 'COLLABORATE') {
            window.location.href = getLinkForView() + '&notifyUser=true';
          }
          copyLink(true);
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

  const displayToast = () => {
    toast.success(
      'The link has been copied to your clipboard and can be shared to ' +
        getMessageForView() +
        ', simply by pasting the link. You can re-access the link by going to share menu.',
      {
        autoClose: 10000,
      },
    );
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
                    shareDiagram(DiagramView.EDIT);
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
                    shareDiagram(DiagramView.GIVE_FEEDBACK);
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
                    shareDiagram(DiagramView.SEE_FEEDBACK);
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
                    shareDiagram(DiagramView.COLLABORATE);
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
                {!token ? (
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
                <Button variant="outline-secondary" onClick={() => copyLink(true)}>
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

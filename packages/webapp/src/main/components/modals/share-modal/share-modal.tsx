import React, { Component } from 'react';
import { Button, Dropdown, DropdownButton, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import { DiagramPermission } from '../../../../../../shared/diagram-permission';
import { TokenRepository } from '../../../services/token/token-repository';
import { Diagram } from '../../../services/diagram/diagram-types';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { DiagramRepository } from '../../../services/diagram/diagram-repository';
import { DEPLOYMENT_URL } from '../../../constant';
import { TokenDTO } from '../../../../../../shared/token-dto';

type OwnProps = {
  show: boolean;
  close: () => void;
};

type StateProps = {
  diagram: Diagram;
};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>((state) => {
  return {
    diagram: state.diagram,
  };
});

const getInitialState = () => {
  return {
    permission: DiagramPermission.EDIT,
    tokens: [] as TokenDTO[],
    isOwner: window.location.href === DEPLOYMENT_URL,
  };
};

type State = typeof getInitialState;

class ShareModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    // this check fails in development setting because webpack dev server url !== deployment url
    DiagramRepository.getDiagramFromServerByLink(DEPLOYMENT_URL).then((diagram) => {
      if (!diagram) {
        this.setState({ diagramExistsOnServer: false });
      } else {
        this.setState({
          diagramExistsOnServer: true,
          diagramSynchronizedWithServer: diagram.lastUpdate === this.props.diagram.lastUpdate,
        });
      }
    });
  }

  handleClose = () => {
    this.props.close();
  };

  getLinkForPermission = (permission: DiagramPermission) => {
    const tokenForPermission = this.state.tokens.find((token) => token.permission === permission)!;
    return `${DEPLOYMENT_URL}/${tokenForPermission.value}`;
  };

  changePermission = (permission: DiagramPermission) => {
    this.setState({ permission });
  };

  copyLink = () => {
    // TODO
    // navigator.clipboard.writeText(this.state.link);
  };

  publishDiagram = () => {
    DiagramRepository.publishDiagramOnServer(this.props.diagram)
      .then((tokens: TokenDTO[]) => {
        this.setState({ diagramExistsOnServer: true, tokens });
      })
      .catch((error) => console.error(error));
  };

  async loadTokens() {
    if (!this.state.tokens) {
      const ownerToken = this.getOwnerToken();
      if (!ownerToken) {
        throw Error('You cannot share the diagram, you are not the owner');
      }
      const tokens = await TokenRepository.getTokensForOwnerToken(ownerToken.value);
      this.setState({ tokens });
    }
  }

  getOwnerToken(): TokenDTO | undefined {
    let ownerToken: TokenDTO | undefined;
    if (this.state.tokens) {
      ownerToken = this.state.tokens.find((token) => token.permission === DiagramPermission.EDIT);
    }
    if (!ownerToken) {
      // TODO: look in local storage
      // ownerToken = new TokenDTO(DiagramPermission.EDIT, 'test');
    }
    return ownerToken;
  }

  render() {
    const { show } = this.props;
    return createPortal(
      <Modal id="share-modal" centered show={show} size="lg" onHide={this.handleClose} dialogClassName="w-75">
        <Modal.Header closeButton>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.getOwnerToken() ? (
            <>
              <InputGroup className="mb-3">
                <FormControl
                  readOnly
                  value={`Everyone with this link can ${
                    this.state.permission === DiagramPermission.EDIT ? 'edit' : 'give feedback to'
                  } this diagram`}
                  bsCustomPrefix="w-100"
                />
                <DropdownButton
                  id="permission-selection-dropdown"
                  title={this.state.permission}
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  className="w-25"
                >
                  {Object.values(DiagramPermission).map((value) => (
                    <Dropdown.Item key={value} onSelect={(eventKey) => this.changePermission(value)}>
                      {value}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </InputGroup>
              <InputGroup className="mb-3">
                <FormControl readOnly value={this.getLinkForPermission(this.state.permission)} />
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
                Your diagram is currently not published on the server. If you want to share the current version of your
                diagram with other users, click on the publish button. Your diagram will then be stored for x days on
                the server.
              </p>
              <Button variant="outline-primary" onClick={(event) => this.publishDiagram()}>
                Publish
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>,
      document.body,
    );
  }
}

export const ShareModal = enhance(ShareModalComponent);

import React, { Component } from "react";
import { Button, Dropdown, DropdownButton, FormControl, InputGroup, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { Diagram } from "../../../services/diagram/diagram-types";
import { connect } from "react-redux";
import { ApplicationState } from "../../store/application-state";
import { DiagramRepository } from "../../../services/diagram/diagram-repository";
import { DEPLOYMENT_URL } from "../../../constant";
import { TokenDTO } from "shared/src/token-dto";
import { DiagramView } from "shared/src/diagram-view";

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
    permission: DiagramView.EDIT,
    tokens: [] as TokenDTO[],
    isOwner: window.location.href === DEPLOYMENT_URL
  };
};

type State = typeof getInitialState;

class ShareModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if (prevProps.diagram.id !== this.props.diagram.id) {
      this.setState(getInitialState());
    }
  }

  handleClose = () => {
    this.props.close();
  };

  getLinkForView = (view: DiagramView) => {
    const tokenForPermission = this.state.tokens.find((token) => token.view === view)!;
    if (!tokenForPermission) {
      return "";
    } else {
      return `${DEPLOYMENT_URL}/${tokenForPermission.value}`;
    }
  };

  changePermission = (permission: DiagramView) => {
    this.setState({ permission });
  };

  copyLink = () => {
    const link = this.getLinkForView(this.state.permission);
    navigator.clipboard.writeText(link);
  };

  publishDiagram = () => {
    DiagramRepository.publishDiagramOnServer(this.props.diagram)
      .then((tokens: TokenDTO[]) => {
        this.setState({ tokens });
      })
      .catch((error) => console.error(error));
  };

  render() {
    const { show } = this.props;
    return createPortal(
      <Modal id="share-modal" centered show={show} size="lg" onHide={this.handleClose} dialogClassName="w-75">
        <Modal.Header closeButton>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.tokens && this.state.tokens.length > 0 ? (
            <>
              <InputGroup className="mb-3">
                <FormControl
                  readOnly
                  value={`Everyone with this link can ${
                    this.state.permission === DiagramView.EDIT ? "edit" : "give feedback to"
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
                  {Object.values(DiagramView).map((value) => (
                    <Dropdown.Item key={value} onSelect={(eventKey) => this.changePermission(value)}>
                      {value}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </InputGroup>
              <InputGroup className="mb-3">
                <FormControl readOnly value={this.getLinkForView(this.state.permission)}/>
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

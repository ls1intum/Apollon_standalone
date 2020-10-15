import React, { Component } from "react";
import { Button, Dropdown, DropdownButton, FormControl, InputGroup, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { Diagram } from "../../../services/diagram/diagram-types";
import { connect } from "react-redux";
import { ApplicationState } from "../../store/application-state";
import { DiagramRepository } from "../../../services/diagram/diagram-repository";
import { DEPLOYMENT_URL } from "../../../constant";
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
    view: DiagramView.EDIT,
    token: "",
    isOwner: window.location.href === DEPLOYMENT_URL
  };
};

type State = typeof getInitialState;

const getDisplayValueForView = (view: DiagramView) => {
  switch (view) {
    case DiagramView.EDIT:
      return "Edit";
    case DiagramView.GIVE_FEEDBACK:
      return "Give Feedback";
    case DiagramView.SEE_FEEDBACK:
      return "See Feedback";
  }
};

class ShareModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if (!prevProps.show && this.props.show) {
      this.setState(getInitialState());
    }
  }

  handleClose = () => {
    this.props.close();
  };

  getLinkForView = (view: DiagramView) => {
    if (!this.state.token) {
      return "";
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
          {this.state.token ? (
            <>
              <InputGroup className="mb-3">
                <FormControl
                  readOnly
                  value={`Everyone with this link can ${
                    this.state.view === DiagramView.EDIT ? "edit" : "give feedback to"
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
                <FormControl readOnly value={this.getLinkForView(this.state.view)}/>
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
      </Modal>,
      document.body,
    );
  }
}

export const ShareModal = enhance(ShareModalComponent);

import React, { Component } from 'react';
import { Button, Dropdown, DropdownButton, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import { DiagramAccess } from '../../../../../../shared/diagram-access';
import { LinkRepository } from '../../../services/link/link-repository';
import { Diagram } from '../../../services/diagram/diagram-types';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';

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
    permission: DiagramAccess.EDIT,
    link: '',
  };
};

type State = typeof getInitialState;

class ShareModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.generateLink();
  }

  handleClose = () => {
    this.props.close();
  };

  generateLink = async () => {
    const response = await LinkRepository.generateLink(this.props.diagram, this.state.permission);
    this.setState({ link: response.link });
  };

  changePermission = (permission: DiagramAccess) => {
    this.setState({ permission });
    this.generateLink();
  };

  copyLink = () => {
    navigator.clipboard.writeText(this.state.link);
  };

  render() {
    const { show } = this.props;
    return createPortal(
      <Modal centered show={show} size="lg" onHide={this.handleClose} dialogClassName="w-75">
        <Modal.Header closeButton>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              readOnly={true}
              value={`Everyone with this link can ${
                this.state.permission === DiagramAccess.EDIT ? 'edit' : 'give feedback to'
              } this diagram`}
              bsCustomPrefix="w-100"
            />
            <DropdownButton
              id="dropdown-basic-button"
              title={this.state.permission}
              as={InputGroup.Append}
              variant="outline-secondary"
              className="w-25"
              onChange={(event) => this.generateLink()}
            >
              {Object.values(DiagramAccess).map((value) => (
                <Dropdown.Item key={value} onSelect={(eventKey) => this.changePermission(value)}>
                  {value}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl readOnly={true} value={this.state.link} />
            <InputGroup.Append className="w-25">
              <Button variant="outline-secondary" className="w-100" onClick={(event) => this.copyLink()}>
                Copy Link
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>
      </Modal>,
      document.body,
    );
  }
}

export const ShareModal = enhance(ShareModalComponent);

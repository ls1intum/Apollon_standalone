import React, { Component } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { bugReportURL } from '../../../constant.js';
import { ModalRepository } from '../../../services/modal/modal-repository.js';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state.js';
import { ModalContentType } from '../../modals/application-modal-types.js';

type OwnProps = {};

type State = { show: boolean };

type StateProps = {};

type DispatchProps = {
  openModal: typeof ModalRepository.showModal;
};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(null, {
  openModal: ModalRepository.showModal,
});

class HelpMenuComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener('click', this.hideMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideMenu);
  }

  showMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ show: true });
    event.stopPropagation();
  };

  hideMenu = (event: MouseEvent) => {
    this.setState({ show: false });
    event.stopPropagation();
  };

  render() {
    return (
      <>
        <NavDropdown
          id="file-menu-item"
          title="Help"
          style={{ paddingTop: 0, paddingBottom: 0 }}
          onClick={this.showMenu}
        >
          <NavDropdown.Item onClick={(event) => this.props.openModal(ModalContentType.HelpModelingModal, 'lg')}>
            How does this Editor work?
          </NavDropdown.Item>
          <NavDropdown.Item onClick={(event) => this.props.openModal(ModalContentType.InformationModal)}>
            About Apollon
          </NavDropdown.Item>
          <a href={bugReportURL} target="_blank" style={{ color: '#212529' }} className="dropdown-item">
            Report a Problem
          </a>
        </NavDropdown>
      </>
    );
  }
}

export const HelpMenu = enhance(HelpMenuComponent);

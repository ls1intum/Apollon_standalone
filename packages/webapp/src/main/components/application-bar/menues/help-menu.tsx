import React, { Component } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { bugReportURL } from '../../../constant';
import { ModalRepository } from '../../../services/modal/modal-repository';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { ModalContentType } from '../../modals/application-modal-types';

type OwnProps = {};

type State = {};

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

  render() {
    return (
      <>
        <NavDropdown id="file-menu-item" title="Help" style={{ paddingTop: 0, paddingBottom: 0 }}>
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

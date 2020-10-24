import React, { Component } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { InformationModal } from '../../modals/information-modal/information-modal';
import { bugReportURL } from '../../../constant';
import { HelpModelingModal } from '../../modals/help-modeling-modal/help-modeling-modal';

type Props = {};

type State = {
  showInformationModal: boolean;
  showHelpModelingModal: boolean;
};

const getInitialState = (): State => {
  return { showInformationModal: false, showHelpModelingModal: false };
};

export class HelpMenu extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.openInformationModal = this.openInformationModal.bind(this);
    this.closeInformationModal = this.closeInformationModal.bind(this);
    this.openHelpModelingModal = this.openHelpModelingModal.bind(this);
    this.closeHelpModelingModal = this.closeHelpModelingModal.bind(this);
  }

  closeInformationModal(): void {
    this.setState({ showInformationModal: false });
  }

  openInformationModal(): void {
    this.setState({ showInformationModal: true });
  }

  closeHelpModelingModal(): void {
    this.setState({ showHelpModelingModal: false });
  }

  openHelpModelingModal(): void {
    this.setState({ showHelpModelingModal: true });
  }

  render() {
    return (
      <>
        <NavDropdown id="file-menu-item" title="Help" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <NavDropdown.Item onClick={this.openHelpModelingModal}>How does this Editor work?</NavDropdown.Item>
          <NavDropdown.Item onClick={this.openInformationModal}>About Apollon</NavDropdown.Item>
          <a href={bugReportURL} target="_blank" style={{ color: '#212529' }} className="dropdown-item">
            Report a Problem
          </a>
        </NavDropdown>
        <InformationModal show={this.state.showInformationModal} close={this.closeInformationModal} />
        <HelpModelingModal show={this.state.showHelpModelingModal} close={this.closeHelpModelingModal} />
      </>
    );
  }
}

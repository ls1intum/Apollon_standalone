import React, { Component } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { InformationModal } from '../../modals/information-modal/information-modal';
import { bugReportURL } from '../../../constant';

type Props = {};

type State = {
  showInformationModal: boolean;
};

const getInitialState = (): State => {
  return { showInformationModal: false };
};

export class HelpMenu extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.openInformationModal = this.openInformationModal.bind(this);
    this.closeInformationModal = this.closeInformationModal.bind(this);
  }

  closeInformationModal(): void {
    this.setState({ showInformationModal: false });
  }

  openInformationModal(): void {
    this.setState({ showInformationModal: true });
  }

  render() {
    return (
      <>
        <NavDropdown id="file-menu-item" title="Help" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <NavDropdown.Item onClick={this.openInformationModal}>About Apollon</NavDropdown.Item>
          <NavDropdown.Item>
            <a href={bugReportURL} onClick={(event) => window.open(bugReportURL)} style={{ color: '#212529' }}>
              Report a Problem
            </a>
          </NavDropdown.Item>
          <InformationModal show={this.state.showInformationModal} close={this.closeInformationModal} />
        </NavDropdown>
      </>
    );
  }
}

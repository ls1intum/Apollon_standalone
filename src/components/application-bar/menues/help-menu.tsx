import React, { Component, ComponentClass } from 'react';
import { NavDropdown, Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { ApollonEditorContext } from '../../apollon-editor-component/apollon-editor-context';
import { LoadDiagramModal } from '../../modals/load-diagram-modal/load-diagram-modal';
import { NewDiagramModel } from '../../modals/new-diagram-modal/new-diagram-modal';
import { Diagram, LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types';
import { localStorageDiagramsList } from '../../../constant';
import moment from 'moment';
import { ExportRepository } from '../../../services/export/export-repository';
import { ImportDiagramModal } from '../../modals/import-diagram-modal/import-diagram-modal';
import { InformationModal } from '../../modals/information-modal/information-modal';

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
        <NavDropdown id="file-menu-item" title="Help" style={{paddingTop: 0, paddingBottom: 0}}>
          <NavDropdown.Item onClick={this.openInformationModal}>How to use this editor?</NavDropdown.Item>
          <NavDropdown.Item onClick={this.openInformationModal}>About Apollon</NavDropdown.Item>
          <InformationModal show={this.state.showInformationModal} close={this.closeInformationModal} />
        </NavDropdown>
      </>
    );
  }
}

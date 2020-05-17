import React, { Component, ComponentClass } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { ApollonEditorContext } from '../../apollon-editor-component/apollon-editor-context';
import { LoadDiagramModal } from '../../modals/load-diagram-modal/load-diagram-modal';
import { NewDiagramModel } from '../../modals/new-diagram-modal/new-diagram-modal';
import { Diagram, LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types';
import { localStorageDiagramPrefix, localStorageDiagramsList } from '../../../constant';
import moment from 'moment';
import { ExportRepository } from '../../../services/export/export-repository';

type Props = {};

type State = {
  showLoadingModal: boolean;
  showNewDiagramModal: boolean;
};

type StateProps = {
  diagram: Diagram | null;
};

type DispatchProps = {
  store: typeof LocalStorageRepository.store;
  exportAsSVG: typeof ExportRepository.exportAsSVG;
  exportAsPNG: typeof ExportRepository.exportAsPNG;
};

const enhance = compose<ComponentClass<Props>>(
  withApollonEditor,
  connect<StateProps, DispatchProps, Props, ApplicationState>(
    (state, props) => {
      return {
        diagram: state.diagram,
      };
    },
    {
      store: LocalStorageRepository.store,
      exportAsSVG: ExportRepository.exportAsSVG,
      exportAsPNG: ExportRepository.exportAsPNG,
    },
  ),
);

type OwnProps = StateProps & DispatchProps & Props & ApollonEditorContext;

const getInitialState = (): State => {
  return { showLoadingModal: false, showNewDiagramModal: false };
};

//TODO: check how to title this if component gets enhanced
class FileMenuComponent extends Component<OwnProps, State> {
  state = getInitialState();

  constructor(props: OwnProps) {
    super(props);
    this.closeLoadingModal = this.closeLoadingModal.bind(this);
    this.openLoadingModal = this.openLoadingModal.bind(this);
    this.openNewDiagramModal = this.openNewDiagramModal.bind(this);
    this.closeNewDiagramModal = this.closeNewDiagramModal.bind(this);
    this.saveDiagram = this.saveDiagram.bind(this);
    this.exportDiagram = this.exportDiagram.bind(this);
  }

  saveDiagram(): void {
    this.props.store(this.props.diagram!.id, this.props.diagram!.title, this.props.editor?.model!);
  }

  closeNewDiagramModal(): void {
    // TODO: leave modal permanent on page or craete it on click and destory after closed?
    this.setState({ showNewDiagramModal: false });
  }

  openNewDiagramModal(): void {
    this.setState({ showNewDiagramModal: true });
  }

  closeLoadingModal(): void {
    // TODO: leave modal permanent on page or craete it on click and destory after closed?
    this.setState({ showLoadingModal: false });
  }

  openLoadingModal(): void {
    this.setState({ showLoadingModal: true });
  }

  exportDiagram(): void {
    if (this.props.editor && this.props.diagram?.title) {
      console.log('export');
      this.props.exportAsPNG(this.props.editor, this.props.diagram?.title);
    }
  }

  getSavedDiagrams(): LocalStorageDiagramListItem[] {
    const localStorage = window.localStorage;
    let localDiagrams: LocalStorageDiagramListItem[] = JSON.parse(localStorage.getItem(localStorageDiagramsList)!);
    localDiagrams = localDiagrams ? localDiagrams : [];
    // create full moment dates
    localDiagrams.forEach((diagram) => (diagram.lastUpdate = moment(diagram.lastUpdate)));
    // sort desc to lastUpdate -> * -1
    localDiagrams.sort(
      (first: LocalStorageDiagramListItem, second: LocalStorageDiagramListItem) =>
        (first.lastUpdate.valueOf() - second.lastUpdate.valueOf()) * -1,
    );
    return localDiagrams;
  }

  render() {
    return (
      <>
        <NavDropdown id="file-menu-item" title="File">
          <NavDropdown.Item onClick={this.openNewDiagramModal}>New</NavDropdown.Item>
          <NavDropdown.Item onClick={this.saveDiagram}>Save</NavDropdown.Item>
          <NavDropdown.Item onClick={this.openLoadingModal}>Load</NavDropdown.Item>
          <NavDropdown.Item onClick={this.exportDiagram}>Export</NavDropdown.Item>
          <LoadDiagramModal
            show={this.state.showLoadingModal}
            close={this.closeLoadingModal}
            diagrams={this.getSavedDiagrams()}
          />

          <NewDiagramModel show={this.state.showNewDiagramModal} close={this.closeNewDiagramModal} />
        </NavDropdown>
      </>
    );
  }
}

export const FileMenu = enhance(FileMenuComponent);

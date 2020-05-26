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

type Props = {};

type State = {
  showLoadingModal: boolean;
  showNewDiagramModal: boolean;
  showImportDiagramModal: boolean;
};

type StateProps = {
  diagram: Diagram | null;
};

type DispatchProps = {
  store: typeof LocalStorageRepository.store;
  exportAsSVG: typeof ExportRepository.exportAsSVG;
  exportAsPNG: typeof ExportRepository.exportAsPNG;
  exportAsJSON: typeof ExportRepository.exportAsJSON;
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
      exportAsJSON: ExportRepository.exportAsJSON,
    },
  ),
);

type OwnProps = StateProps & DispatchProps & Props & ApollonEditorContext;

const getInitialState = (): State => {
  return { showLoadingModal: false, showNewDiagramModal: false, showImportDiagramModal: false };
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
    this.openImportDiagramModal = this.openImportDiagramModal.bind(this);
    this.closeImportDiagramModal = this.closeImportDiagramModal.bind(this);
    this.saveDiagram = this.saveDiagram.bind(this);
    this.exportDiagram = this.exportDiagram.bind(this);
  }

  saveDiagram(): void {
    this.props.store(this.props.diagram!);
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

  openImportDiagramModal(): void {
    this.setState({ showImportDiagramModal: true });
  }

  closeImportDiagramModal(): void {
    // TODO: leave modal permanent on page or craete it on click and destory after closed?
    this.setState({ showImportDiagramModal: false });
  }

  openLoadingModal(): void {
    this.setState({ showLoadingModal: true });
  }

  exportDiagram(exportType: 'PNG' | 'SVG' | 'JSON'): void {
    if (this.props.editor && this.props.diagram?.title) {
      switch (exportType) {
        case 'SVG':
          this.props.exportAsSVG(this.props.editor, this.props.diagram?.title);
          break;
        case 'PNG':
          this.props.exportAsPNG(this.props.editor, this.props.diagram?.title);
          break;
        case 'JSON':
          this.props.exportAsJSON(this.props.editor, this.props.diagram!);
      }
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
        <NavDropdown id="file-menu-item" title="File" className='pt-0, pb-0'>
          <NavDropdown.Item onClick={this.openNewDiagramModal}>New</NavDropdown.Item>
          <NavDropdown.Item onClick={this.openLoadingModal}>Load</NavDropdown.Item>
          <NavDropdown.Item onClick={this.openImportDiagramModal}>Import</NavDropdown.Item>
          <Dropdown id="export-dropdown" drop="right">
            <Dropdown.Toggle
              id="dropdown-basic"
              split
              className="bg-transparent w-100 text-dark text-left pl-4 border-white d-flex align-items-center"
            >
              <span className="flex-grow-1">Export</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={(event: any) => this.exportDiagram('SVG')}>As SVG</Dropdown.Item>
              <Dropdown.Item onClick={(event: any) => this.exportDiagram('PNG')}>As PNG</Dropdown.Item>
              <Dropdown.Item onClick={(event: any) => this.exportDiagram('JSON')}>As JSON</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <LoadDiagramModal
            show={this.state.showLoadingModal}
            close={this.closeLoadingModal}
            diagrams={this.getSavedDiagrams()}
          />
          <NewDiagramModel show={this.state.showNewDiagramModal} close={this.closeNewDiagramModal} />
          <ImportDiagramModal show={this.state.showImportDiagramModal} close={this.closeImportDiagramModal} />
        </NavDropdown>
      </>
    );
  }
}

export const FileMenu = enhance(FileMenuComponent);

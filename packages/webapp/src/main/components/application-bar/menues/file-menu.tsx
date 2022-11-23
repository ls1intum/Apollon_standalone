import React, { Component, ComponentClass } from 'react';
import { NavDropdown, Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { ApollonEditorContext } from '../../apollon-editor-component/apollon-editor-context';
import { ExportRepository } from '../../../services/export/export-repository';
import { Diagram } from '../../../services/diagram/diagram-types';
import { ModalRepository } from '../../../services/modal/modal-repository';
import { ModalContentType } from '../../modals/application-modal-types';

type Props = {};

type State = {
  show: boolean;
};

type StateProps = {
  diagram: Diagram | null;
};

type DispatchProps = {
  exportAsSVG: typeof ExportRepository.exportAsSVG;
  exportAsPNG: typeof ExportRepository.exportAsPNG;
  exportAsJSON: typeof ExportRepository.exportAsJSON;
  exportAsPDF: typeof ExportRepository.exportAsPDF;
  openModal: typeof ModalRepository.showModal;
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
      exportAsSVG: ExportRepository.exportAsSVG,
      exportAsPNG: ExportRepository.exportAsPNG,
      exportAsJSON: ExportRepository.exportAsJSON,
      exportAsPDF: ExportRepository.exportAsPDF,
      openModal: ModalRepository.showModal,
    },
  ),
);

type OwnProps = StateProps & DispatchProps & Props & ApollonEditorContext;

class FileMenuComponent extends Component<OwnProps, State> {
  constructor(props: OwnProps) {
    super(props);
    this.exportDiagram = this.exportDiagram.bind(this);
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

  exportDiagram(exportType: 'PNG' | 'PNG_WHITE' | 'SVG' | 'JSON' | 'PDF'): void {
    if (this.props.editor && this.props.diagram?.title) {
      switch (exportType) {
        case 'SVG':
          this.props.exportAsSVG(this.props.editor, this.props.diagram?.title);
          break;
        case 'PNG_WHITE':
          this.props.exportAsPNG(this.props.editor, this.props.diagram?.title, true);
          break;
        case 'PNG':
          this.props.exportAsPNG(this.props.editor, this.props.diagram?.title, false);
          break;
        case 'PDF':
          this.props.exportAsPDF(this.props.editor, this.props.diagram?.title);
          break;
        case 'JSON':
          this.props.exportAsJSON(this.props.editor, this.props.diagram);
      }
    }
  }

  render() {
    return (
      <>
        <NavDropdown id="file-menu-item" title="File" className="pt-0, pb-0" onClick={this.showMenu}>
          <NavDropdown.Item onClick={(event) => this.props.openModal(ModalContentType.CreateDiagramModal)}>
            New
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={(event) => this.props.openModal(ModalContentType.CreateDiagramFromTemplateModal, 'lg')}
          >
            Start from Template
          </NavDropdown.Item>
          <NavDropdown.Item onClick={(event) => this.props.openModal(ModalContentType.LoadDiagramModal)}>
            Load
          </NavDropdown.Item>
          <NavDropdown.Item onClick={(event) => this.props.openModal(ModalContentType.ImportDiagramModal)}>
            Import
          </NavDropdown.Item>
          <Dropdown id="export-dropdown" drop="end">
            <Dropdown.Toggle
              id="dropdown-basic"
              split
              className="bg-transparent w-100 text-start ps-3 d-flex align-items-center"
            >
              <span className="flex-grow-1">Export</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={(event: any) => this.exportDiagram('SVG')}>As SVG</Dropdown.Item>
              <Dropdown.Item onClick={(event: any) => this.exportDiagram('PNG_WHITE')}>
                As PNG (White Background)
              </Dropdown.Item>
              <Dropdown.Item onClick={(event: any) => this.exportDiagram('PNG')}>
                As PNG (Transparent Background)
              </Dropdown.Item>
              <Dropdown.Item onClick={(event: any) => this.exportDiagram('JSON')}>As JSON</Dropdown.Item>
              <Dropdown.Item onClick={(event: any) => this.exportDiagram('PDF')}>As PDF</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </NavDropdown>
      </>
    );
  }
}

export const FileMenu = enhance(FileMenuComponent);

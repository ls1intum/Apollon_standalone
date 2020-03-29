import React, { Component } from 'react';
import { Dropdown, NavDropdown } from 'react-bootstrap';
import { LoadDiagramModal } from '../../load-diagram-modal/load-diagram-modal';
import { UMLModel } from '@ls1intum/apollon';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { ApollonEditorContext } from '../../apollon-editor-component/apollon-editor-context';

type Props = {};

type State = {
  showLoadingModal: boolean;
};

type StateProps = {
  model: UMLModel | null;
};

type DispatchProps = {
  validateStore: typeof LocalStorageRepository.validateStore;
};

const enhance = compose(
  withApollonEditor,
  connect<StateProps, DispatchProps, Props, ApplicationState>(
    (state, props) => {
      return {
        model: state.model,
      };
    },
    {
      validateStore: LocalStorageRepository.validateStore,
    },
  ),
);

type OwnProps = StateProps & DispatchProps & Props & ApollonEditorContext;

const getInitialState = (): State => {
  return { showLoadingModal: false };
};

const diagrams = [
  { id: 'test', model: {} as UMLModel },
  { id: 'test1', model: {} as UMLModel },
];

class fileMenu extends Component<OwnProps, State> {
  state = getInitialState();

  constructor(props: OwnProps) {
    super(props);
    this.closeLoadingModal = this.closeLoadingModal.bind(this);
    this.openLoadingModal = this.openLoadingModal.bind(this);
    this.saveDiagram = this.saveDiagram.bind(this);
  }

  saveDiagram(): void {
    console.log('save start');
    this.props.validateStore(this.props.editor?.model!);
    console.log('save end');
  }

  closeLoadingModal(): void {
    // TODO: leave modal permanent on page or craete it on click and destory after closed?
    this.setState({ showLoadingModal: false });
  }

  openLoadingModal(): void {
    this.setState({ showLoadingModal: true });
  }

  render() {
    return (
      <>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item onClick={this.saveDiagram}> Save</NavDropdown.Item>
          <NavDropdown.Item onClick={this.openLoadingModal}>Load</NavDropdown.Item>
          <LoadDiagramModal
            show={this.state.showLoadingModal}
            close={this.closeLoadingModal}
            diagrams={diagrams}
          ></LoadDiagramModal>
          <NavDropdown.Item>
            <Dropdown drop="right" id="basic-nav-dropdown">
              <Dropdown.Toggle id="newDiagram">New Diagram</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </NavDropdown.Item>
        </NavDropdown>
      </>
    );
  }
}

export const FileMenu = enhance(fileMenu);

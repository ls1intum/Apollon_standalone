import { Component, ComponentClass } from 'react';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository.js';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor.js';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state.js';
import { LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types.js';
import { LoadDiagramContent } from './load-diagram-content.js';
import { ModalContentProps } from '../application-modal-types.js';

type OwnProps = {} & ModalContentProps;

type State = {};

type DispatchProps = {
  load: typeof LocalStorageRepository.load;
};

type StateProps = {
  currentDiagramId?: string;
};

type Props = StateProps & DispatchProps & OwnProps;

const enhance = compose<ComponentClass<OwnProps>>(
  withApollonEditor,
  connect<StateProps, DispatchProps, Props, ApplicationState>(
    (state) => ({
      currentDiagramId: state.diagram?.id,
    }),
    {
      load: LocalStorageRepository.load,
    },
  ),
);

const getInitialState = (): State => {
  return {
    selectedDiagramId: undefined,
  };
};

class LoadDiagramModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.loadDiagram = this.loadDiagram.bind(this);
  }

  getSavedDiagrams(): LocalStorageDiagramListItem[] {
    // load localStorageList
    const localDiagrams = LocalStorageRepository.getStoredDiagrams();
    // return all diagrams, but the current displayed diagram
    return localDiagrams.filter((storedDiagram) => storedDiagram.id !== this.props.currentDiagramId);
  }

  handleClose = () => {
    this.props.close();
    this.setState(getInitialState());
  };

  loadDiagram = (id: string) => {
    if (id) {
      this.props.load(id);
    }
    this.handleClose();
  };

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Load Diagram</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoadDiagramContent diagrams={this.getSavedDiagrams()} onSelect={this.loadDiagram} />
        </Modal.Body>
      </>
    );
  }
}

export const LoadDiagramModal = enhance(LoadDiagramModalComponent);

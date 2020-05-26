import { Component, ComponentClass, ReactPortal } from 'react';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types';
import { LoadDiagramContent } from './load-diagram-content';

type OwnProps = {
  show: boolean;
  close: () => void;
  diagrams: LocalStorageDiagramListItem[];
};

type State = {
  selectedDiagramId?: string;
};

type DispatchProps = {
  load: typeof LocalStorageRepository.load;
};

type StateProps = {};

type Props = StateProps & DispatchProps & OwnProps;

const enhance = compose<ComponentClass<OwnProps>>(
  withApollonEditor,
  connect<StateProps, DispatchProps, Props, ApplicationState>(null, {
    load: LocalStorageRepository.load,
  }),
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

  handleClose = () => {
    this.props.close();
    this.setState(getInitialState());
  };

  select = (id: string) => this.setState({ selectedDiagramId: id });

  loadDiagram = () => {
    if (this.state.selectedDiagramId){
      this.props.load(this.state.selectedDiagramId);
    }
    this.handleClose();
  };

  render(): ReactPortal {
    const { show } = this.props;
    return createPortal(
      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Load Diagram</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoadDiagramContent diagrams={this.props.diagrams} onSelect={this.select.bind(this)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={(event: any) => this.loadDiagram()}
            disabled={!this.state.selectedDiagramId}
          >
            Load Diagram
          </Button>
        </Modal.Footer>
      </Modal>,
      document.body,
    );
  }
}

export const LoadDiagramModal = enhance(LoadDiagramModalComponent);

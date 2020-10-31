import { Component, ComponentClass } from 'react';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { LocalStorageDiagramListItem } from '../../../services/local-storage/local-storage-types';
import { LoadDiagramContent } from './load-diagram-content';
import { localStorageDiagramsList } from '../../../constant';
import moment from 'moment';

type OwnProps = {
  close: () => void;
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
    this.select = this.select.bind(this);
  }

  getSavedDiagrams(): LocalStorageDiagramListItem[] {
    // load localStorageList
    const localStorageDiagramList = window.localStorage.getItem(localStorageDiagramsList);
    let localDiagrams: LocalStorageDiagramListItem[];
    if (localStorageDiagramList) {
      localDiagrams = JSON.parse(localStorageDiagramList);
      // create full moment dates
      localDiagrams.forEach((diagram) => (diagram.lastUpdate = moment(diagram.lastUpdate)));
      // sort desc to lastUpdate -> * -1
      localDiagrams.sort(
        (first: LocalStorageDiagramListItem, second: LocalStorageDiagramListItem) =>
          (first.lastUpdate.valueOf() - second.lastUpdate.valueOf()) * -1,
      );
    } else {
      localDiagrams = [];
    }
    return localDiagrams;
  }

  handleClose = () => {
    this.props.close();
    this.setState(getInitialState());
  };

  select = (id: string) => this.setState({ selectedDiagramId: id });

  loadDiagram = () => {
    if (this.state.selectedDiagramId) {
      this.props.load(this.state.selectedDiagramId);
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
          <LoadDiagramContent diagrams={this.getSavedDiagrams()} onSelect={this.select} />
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
      </>
    );
  }
}

export const LoadDiagramModal = enhance(LoadDiagramModalComponent);

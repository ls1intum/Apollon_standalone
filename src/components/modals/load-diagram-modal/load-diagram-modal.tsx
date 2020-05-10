import { Component, ComponentClass, ReactPortal } from 'react';
import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { UMLModel } from '@ls1intum/apollon';
import { createPortal } from 'react-dom';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';

type OwnProps = {
  show: boolean;
  close: () => void;
  diagramIds: string[];
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
  return {};
};

class LoadDiagramModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.loadDiagram = this.loadDiagram.bind(this);
  }

  handleClose = () => this.props.close();

  select = (id: string) => this.setState({ selectedDiagramId: id });

  loadDiagram = () => this.props.load(this.state.selectedDiagramId!);

  render(): ReactPortal {
    const { show } = this.props;
    return createPortal(
      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Load Diagram</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {this.props.diagramIds &&
              this.props.diagramIds.map((value, index, array) => (
                <ListGroup.Item
                  key={value}
                  action
                  onClick={(event: any) => this.select(value)}
                  active={this.state.selectedDiagramId ? this.state.selectedDiagramId === value : false}
                >
                  {value}
                </ListGroup.Item>
              ))}
          </ListGroup>
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

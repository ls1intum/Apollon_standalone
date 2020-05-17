import { UMLDiagramType } from '@ls1intum/apollon';
import React, { Component, ComponentClass, ReactPortal } from 'react';
import { createPortal } from 'react-dom';
import { Button, ListGroup, Modal, FormControl, InputGroup } from 'react-bootstrap';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { LocalStorageRepository } from '../../../services/local-storage/local-storage-repository';

type OwnProps = {
  show: boolean;
  close: () => void;
};

type State = {
  selectedDiagramType: string;
  diagramTitle: string;
  generatedTitle: boolean;
};

const getInitialState = (): State => {
  return {
    selectedDiagramType: UMLDiagramType.ClassDiagram,
    diagramTitle: UMLDiagramType.ClassDiagram,
    generatedTitle: true,
  };
};

type DispatchProps = {
  createDiagram: typeof LocalStorageRepository.createDiagram;
};

type StateProps = {};

type Props = StateProps & DispatchProps & OwnProps;

const enhance = compose<ComponentClass<OwnProps>>(
  withApollonEditor,
  connect<StateProps, DispatchProps, Props, ApplicationState>(null, {
    createDiagram: LocalStorageRepository.createDiagram,
  }),
);

class NewDiagramModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.createNewDiagram = this.createNewDiagram.bind(this);
  }

  handleClose = () => {
    this.props.close();
    this.setState(getInitialState());
  };

  select = (diagramType: UMLDiagramType) => {
    const newState = { ...this.state, selectedDiagramType: diagramType };
    if (this.state.generatedTitle || !this.state.diagramTitle) {
      const diagramTitle = this.generateDiagramTitle(diagramType);
      newState.diagramTitle = diagramTitle;
      newState.generatedTitle = true;
    }
    this.setState(newState);
  };
  changeDiagramTitle = (event: any) => {
    this.setState({ diagramTitle: event.target.value, generatedTitle: false });
  };

  createNewDiagram() {
    this.props.createDiagram(this.state.diagramTitle, this.state.selectedDiagramType as UMLDiagramType);
    this.handleClose();
  }

  generateDiagramTitle(type: UMLDiagramType): string {
    return type;
  }

  render(): ReactPortal {
    const { show } = this.props;
    return createPortal(
      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Diagram</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="diagram-title">Diagram Title</label>
          <InputGroup className="mb-3">
            <FormControl id="diagram-title" value={this.state.diagramTitle} onChange={this.changeDiagramTitle} />
          </InputGroup>
          <label htmlFor="diagram-type-list">Diagram Type</label>
          <ListGroup id="diagram-type-list">
            {Object.values(UMLDiagramType).map((value, index, array) => (
              <ListGroup.Item
                key={value}
                action
                onClick={(event: any) => this.select(value)}
                active={this.state.selectedDiagramType ? this.state.selectedDiagramType === value : false}
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
          <Button variant="primary" onClick={this.createNewDiagram} disabled={!this.state.selectedDiagramType}>
            Create Diagram
          </Button>
        </Modal.Footer>
      </Modal>,
      document.body,
    );
  }
}

export const NewDiagramModel = enhance(NewDiagramModalComponent);

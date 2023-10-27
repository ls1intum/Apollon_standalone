import { UMLDiagramType } from '@ls1intum/apollon';
import React, { Component, ComponentClass } from 'react';
import { Badge, Button, FormControl, InputGroup, ListGroup, Modal } from 'react-bootstrap';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { DiagramRepository } from '../../../services/diagram/diagram-repository';
import { ModalContentProps } from '../application-modal-types';

type OwnProps = {} & ModalContentProps;

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
  createDiagram: typeof DiagramRepository.createDiagram;
};

type StateProps = {};

type Props = StateProps & DispatchProps & OwnProps;

const enhance = compose<ComponentClass<OwnProps>>(
  withApollonEditor,
  connect<StateProps, DispatchProps, OwnProps, ApplicationState>(null, {
    createDiagram: DiagramRepository.createDiagram,
  }),
);

const diagramsInBeta: string[] = ['BPMN'];

class CreateDiagramModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.createNewDiagram = this.createNewDiagram.bind(this);
  }

  select = (diagramType: UMLDiagramType) => {
    const newState = { ...this.state, selectedDiagramType: diagramType };
    if (this.state.generatedTitle || !this.state.diagramTitle) {
      newState.diagramTitle = this.generateDiagramTitle(diagramType);
      newState.generatedTitle = true;
    }
    this.setState(newState);
  };
  changeDiagramTitle = (event: any) => {
    this.setState({ diagramTitle: event.target.value, generatedTitle: false });
  };

  createNewDiagram() {
    this.props.createDiagram(this.state.diagramTitle, this.state.selectedDiagramType as UMLDiagramType);
    this.props.close();
  }

  generateDiagramTitle(type: UMLDiagramType): string {
    return type;
  }

  render() {
    return (
      <>
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
                {diagramsInBeta.includes(value) && (
                  <Badge className="ml-1" bg="secondary">
                    Beta
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.close}>
            Close
          </Button>
          <Button variant="primary" onClick={this.createNewDiagram} disabled={!this.state.selectedDiagramType}>
            Create Diagram
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export const CreateDiagramModal = enhance(CreateDiagramModalComponent);

import React, { Component, ComponentClass } from 'react';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { ListGroup, Modal, Tabs, Button, Tab, InputGroup, FormControl } from 'react-bootstrap';
import { DiagramRepository } from '../../../services/diagram/diagram-repository';
import { getPatternsForCategory, Pattern, PatternCategory, PatternToModelMapping } from './diagram-from-template-modal-types';
import { UMLDiagramType } from '@ls1intum/apollon/lib/typings';

function patternTabComponentForCategory(
  category: PatternCategory,
  selectedPattern: Pattern,
  selectPattern: (pattern: Pattern) => void,
) {
  return (
    <Tab eventKey={category} title={category} tabClassName="pl-2 pr-2" className="mt-1">
      <ListGroup id="diagram-type-list">
        {getPatternsForCategory(category).map((value, index, array) => (
          <ListGroup.Item
            key={value}
            action
            onClick={(event: any) => selectPattern(value)}
            active={selectedPattern ? selectedPattern === value : false}
          >
            {value}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Tab>
  );
}

type OwnProps = {
  close: () => void;
};

type State = {
  selectedPattern: Pattern;
  selectedPatternCategory: PatternCategory;
};

const getInitialState = (): State => {
  return {
    selectedPattern: Pattern.ADAPTER,
    selectedPatternCategory: PatternCategory.STRUCTURAL,
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

class DiagramFromTemplateModalComponent extends Component<Props, State> {
  state = getInitialState();

  constructor(props: Props) {
    super(props);
    this.createNewDiagram = this.createNewDiagram.bind(this);
  }

  selectPattern = (pattern: Pattern) => {
    const newState: State = { ...this.state, selectedPattern: pattern };
    this.setState(newState);
  };

  selectPatternCategory = (patternCategory: PatternCategory) => {
    const newState: State = { ...this.state, selectedPatternCategory: patternCategory };
    this.setState(newState);
  };

  createNewDiagram() {
    this.props.createDiagram(
      this.state.selectedPattern,
      UMLDiagramType.ClassDiagram,
      PatternToModelMapping[this.state.selectedPattern],
    );
  }

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Create New Diagram</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="selected-pattern">Selected Pattern</label>
          <InputGroup className="mb-3">
            <FormControl id="selected-pattern" value={this.state.selectedPattern} disabled />
          </InputGroup>
          <Tabs
            className="flex-row"
            activeKey={this.state.selectedPatternCategory}
            onSelect={(patternCategory) => this.selectPatternCategory(patternCategory as PatternCategory)}
          >
            {patternTabComponentForCategory(PatternCategory.STRUCTURAL, this.state.selectedPattern, this.selectPattern)}
            {patternTabComponentForCategory(PatternCategory.BEHAVIORAL, this.state.selectedPattern, this.selectPattern)}
            {patternTabComponentForCategory(PatternCategory.CREATIONAL, this.state.selectedPattern, this.selectPattern)}
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.close}>
            Close
          </Button>
          <Button variant="primary" onClick={this.createNewDiagram} disabled={!this.state.selectedPattern}>
            Create Diagram
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export const DiagramFromTemplateModal = enhance(DiagramFromTemplateModalComponent);

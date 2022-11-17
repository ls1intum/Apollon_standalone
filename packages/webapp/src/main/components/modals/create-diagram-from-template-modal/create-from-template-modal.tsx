import React, { Component, ComponentClass } from 'react';
import { compose } from 'redux';
import { withApollonEditor } from '../../apollon-editor-component/with-apollon-editor';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { Modal, Button, InputGroup, FormControl, Tab, Col, Row, Nav } from 'react-bootstrap';
import { DiagramRepository } from '../../../services/diagram/diagram-repository';
import { Template, TemplateCategory } from './template-types';
import { SoftwarePatternTemplate, SoftwarePatternType } from './software-pattern/software-pattern-types';
import { CreateFromSoftwarePatternModalTab } from './software-pattern/create-from-software-pattern-modal-tab';
import { TemplateFactory } from './template-factory';
import { ModalContentProps } from '../application-modal-types';

type OwnProps = {} & ModalContentProps;

type State = {
  selectedTemplate: Template;
  selectedTemplateCategory: TemplateCategory;
};

const getInitialState = (): State => {
  return {
    selectedTemplate: TemplateFactory.createSoftwarePattern(SoftwarePatternType.ADAPTER),
    selectedTemplateCategory: TemplateCategory.SOFTWARE_PATTERN,
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
    this.selectTemplate = this.selectTemplate.bind(this);
  }

  selectTemplateCategory = (templateCategory: TemplateCategory) => {
    const newState: State = { ...this.state, selectedTemplateCategory: templateCategory };
    this.setState(newState);
  };

  selectTemplate = (template: Template) => {
    const newState: State = { ...this.state, selectedTemplate: template };
    this.setState(newState);
  };

  createNewDiagram() {
    this.props.createDiagram(
      this.state.selectedTemplate.type,
      this.state.selectedTemplate.diagramType,
      this.state.selectedTemplate.diagram,
    );
    this.props.close();
  }

  render() {
    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Start Diagram from Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container id="left-tabs-example" defaultActiveKey={this.state.selectedTemplateCategory}>
            <Row>
              <Col sm={3} className="border-right border-secondary">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link
                      className="text-nowrap"
                      eventKey={TemplateCategory.SOFTWARE_PATTERN}
                      onSelect={(templateCategory) => this.selectTemplateCategory(templateCategory as unknown as TemplateCategory)}
                    >
                      {TemplateCategory.SOFTWARE_PATTERN}
                    </Nav.Link>
                  </Nav.Item>
                  {/*<Nav.Item>*/}
                  {/*  <Nav.Link eventKey="other" className="text-nowrap">*/}
                  {/*    Other*/}
                  {/*  </Nav.Link>*/}
                  {/*</Nav.Item>*/}
                </Nav>
              </Col>
              <Col sm={9}>
                <label htmlFor="selected-template">Selected Template</label>
                <InputGroup className="mb-3">
                  <FormControl id="selected-template" value={this.state.selectedTemplate.type} disabled />
                </InputGroup>
                <Tab.Content>
                  <Tab.Pane eventKey={TemplateCategory.SOFTWARE_PATTERN}>
                    <CreateFromSoftwarePatternModalTab
                      selectedTemplate={this.state.selectedTemplate as SoftwarePatternTemplate}
                      selectTemplate={this.selectTemplate}
                    />
                  </Tab.Pane>
                  {/*<Tab.Pane eventKey="other"></Tab.Pane>*/}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.close}>
            Close
          </Button>
          <Button variant="primary" onClick={this.createNewDiagram} disabled={!this.state.selectedTemplate}>
            Create Diagram
          </Button>
        </Modal.Footer>
      </>
    );
  }
}

export const CreateFromTemplateModal = enhance(DiagramFromTemplateModalComponent);

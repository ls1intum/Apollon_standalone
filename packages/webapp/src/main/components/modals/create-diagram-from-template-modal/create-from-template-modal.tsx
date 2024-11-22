import React, { useState } from 'react';
import { Button, Col, FormControl, InputGroup, Modal, Nav, Row, Tab } from 'react-bootstrap';
import { Template, TemplateCategory } from './template-types';
import { SoftwarePatternType } from './software-pattern/software-pattern-types';
import { CreateFromSoftwarePatternModalTab } from './software-pattern/create-from-software-pattern-modal-tab';
import { TemplateFactory } from './template-factory';
import { ModalContentProps } from '../application-modal-types';
import { useAppDispatch } from '../../store/hooks';
import { createDiagram } from '../../../services/diagram/diagramSlice';

export const CreateFromTemplateModal: React.FC<ModalContentProps> = ({ close }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(
    TemplateFactory.createSoftwarePattern(SoftwarePatternType.ADAPTER),
  );
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<TemplateCategory>(
    TemplateCategory.SOFTWARE_PATTERN,
  );

  const dispatch = useAppDispatch();

  const selectTemplateCategory = (templateCategory: TemplateCategory) => {
    setSelectedTemplateCategory(templateCategory);
  };

  const selectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const createNewDiagram = () => {
    dispatch(
      createDiagram({
        title: selectedTemplate.type,
        diagramType: selectedTemplate.diagramType,
        template: selectedTemplate.diagram,
      }),
    );
    close();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Start Diagram from Template</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container id="left-tabs-example" defaultActiveKey={selectedTemplateCategory}>
          <Row>
            <Col sm={3} className="border-end border-secondary">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link
                    className="text-nowrap"
                    eventKey={TemplateCategory.SOFTWARE_PATTERN}
                    onSelect={(templateCategory) =>
                      selectTemplateCategory(templateCategory as unknown as TemplateCategory)
                    }
                  >
                    {TemplateCategory.SOFTWARE_PATTERN}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <label htmlFor="selected-template">Selected Template</label>
              <InputGroup className="mb-3">
                <FormControl id="selected-template" value={selectedTemplate.type} disabled />
              </InputGroup>
              <Tab.Content>
                <Tab.Pane eventKey={TemplateCategory.SOFTWARE_PATTERN}>
                  <CreateFromSoftwarePatternModalTab
                    selectedTemplate={selectedTemplate}
                    selectTemplate={selectTemplate}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={createNewDiagram} disabled={!selectedTemplate}>
          Create Diagram
        </Button>
      </Modal.Footer>
    </>
  );
};

import { UMLDiagramType } from '@ls1intum/apollon';
import React, { useState } from 'react';
import { Badge, Button, FormControl, InputGroup, ListGroup, Modal } from 'react-bootstrap';
import { ModalContentProps } from '../application-modal-types';
import posthog from 'posthog-js';
import { useAppDispatch } from '../../store/hooks';
import { createDiagram } from '../../../services/diagram/diagramSlice';

const diagramsInBeta: string[] = ['BPMN'];

export const CreateDiagramModal: React.FC<ModalContentProps> = (props) => {
  const [selectedDiagramType, setSelectedDiagramType] = useState<UMLDiagramType>(UMLDiagramType.ClassDiagram);
  const [diagramTitle, setDiagramTitle] = useState<string>(UMLDiagramType.ClassDiagram);

  const dispatch = useAppDispatch();

  const createNewDiagram = () => {
    dispatch(createDiagram({ diagramTitle, diagramType: selectedDiagramType }));

    posthog.capture('diagram_created', {
      title: diagramTitle,
      type: selectedDiagramType,
    });

    props.close();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create New Diagram</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="diagram-title">Diagram Title</label>
        <InputGroup className="mb-3">
          <FormControl id="diagram-title" value={diagramTitle} onChange={(e) => setDiagramTitle(e.target.value)} />
        </InputGroup>
        <label htmlFor="diagram-type-list">Diagram Type</label>
        <ListGroup id="diagram-type-list">
          {Object.values(UMLDiagramType).map((value) => (
            <ListGroup.Item
              key={value}
              action
              onClick={() => {
                setSelectedDiagramType(value);
                setDiagramTitle(value);
              }}
              active={selectedDiagramType === value}
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
        <Button variant="secondary" onClick={props.close}>
          Close
        </Button>
        <Button variant="primary" onClick={createNewDiagram} disabled={!selectedDiagramType}>
          Create Diagram
        </Button>
      </Modal.Footer>
    </>
  );
};

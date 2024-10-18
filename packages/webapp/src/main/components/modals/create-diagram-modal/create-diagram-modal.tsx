import { UMLDiagramType } from '@ls1intum/apollon';
import React, { useState } from 'react';
import { Badge, Button, Card, FormControl, InputGroup, ListGroup, Modal } from 'react-bootstrap';
import { ModalContentProps } from '../application-modal-types';
import posthog from 'posthog-js';
import { useAppDispatch } from '../../store/hooks';
import { createDiagram } from '../../../services/diagram/diagramSlice';
import { useNavigate } from 'react-router-dom';

const diagramsInBeta: string[] = ['BPMN'];

const diagramNamesMap: { [key in UMLDiagramType]: string } = {
  ClassDiagram: 'Class Diagram',
  ObjectDiagram: 'Object Diagram',
  ActivityDiagram: 'Activity Diagram',
  UseCaseDiagram: 'Use Case Diagram',
  CommunicationDiagram: 'Communication Diagram',
  ComponentDiagram: 'Component Diagram',
  DeploymentDiagram: 'Deployment Diagram',
  PetriNet: 'Petri Net',
  ReachabilityGraph: 'Reachability Graph',
  SyntaxTree: 'Syntax Tree',
  Flowchart: 'Flowchart',
  BPMN: 'BPMN Diagram',
};

// Separating diagrams into Behavioral and Structural categories
const behavioralDiagrams = [
  'ActivityDiagram',
  'UseCaseDiagram',
  'CommunicationDiagram',
  'PetriNet',
  'ReachabilityGraph',
  'BPMN',
] as UMLDiagramType[];

const structuralDiagrams = [
  'ClassDiagram',
  'ObjectDiagram',
  'ComponentDiagram',
  'DeploymentDiagram',
  'Flowchart',
  'SyntaxTree',
] as UMLDiagramType[];

export const CreateDiagramModal: React.FC<ModalContentProps> = ({ close }) => {
  const [selectedDiagramType, setSelectedDiagramType] = useState<UMLDiagramType>(UMLDiagramType.ClassDiagram);
  const [title, setTitle] = useState<string>(diagramNamesMap[UMLDiagramType.ClassDiagram]);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const createNewDiagram = (diagramType: UMLDiagramType) => {
    dispatch(createDiagram({ title, diagramType }));

    posthog.capture('diagram_created', {
      title,
      type: selectedDiagramType,
    });
    navigate('/');

    close();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Create New Diagram</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="diagram-title" className="form-label">
          Diagram Title
        </label>
        <InputGroup className="mb-3">
          <FormControl
            id="diagram-title"
            placeholder="Enter diagram title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputGroup>
        <label htmlFor="diagram-type-list" className="form-label mt-3">
          Diagram Type
        </label>
        {/* Structural Diagrams */}
        <Card className="mb-3">
          <Card.Header as="h5">Structural Diagrams</Card.Header>
          <ListGroup variant="flush">
            {structuralDiagrams.map((diagramType) => (
              <ListGroup.Item
                key={diagramType}
                action
                onClick={() => setSelectedDiagramType(diagramType)}
                onDoubleClick={() => {
                  createNewDiagram(diagramType); // Automatically trigger diagram creation on double-click
                }}
                active={selectedDiagramType === diagramType}
              >
                {diagramNamesMap[diagramType]}
                {diagramsInBeta.includes(diagramType) && (
                  <Badge className="ml-1" bg="secondary">
                    Beta
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>

        {/* Behavioral Diagrams */}
        <Card className="mb-3">
          <Card.Header as="h5">Behavioral Diagrams</Card.Header>
          <ListGroup variant="flush">
            {behavioralDiagrams.map((diagramType) => (
              <ListGroup.Item
                key={diagramType}
                action
                onClick={() => setSelectedDiagramType(diagramType)}
                onDoubleClick={() => {
                  createNewDiagram(diagramType);
                }}
                active={selectedDiagramType === diagramType}
              >
                {diagramNamesMap[diagramType]}
                {diagramsInBeta.includes(diagramType) && (
                  <Badge className="ml-1" bg="secondary">
                    Beta
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={() => createNewDiagram(selectedDiagramType)} disabled={!selectedDiagramType}>
          Create Diagram
        </Button>
      </Modal.Footer>
    </>
  );
};

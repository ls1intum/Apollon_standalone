import { Component, ReactPortal } from 'react';
import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { UMLModel } from '@ls1intum/apollon';
import { createPortal } from 'react-dom';

type Props = {
  show: boolean;
  close: () => void;
  diagrams: { id: string; model: UMLModel }[];
};

type State = {
  selectedDiagramId?: string;
};

const getInitialState = (): State => {
  return {};
};

export class LoadDiagramModal extends Component<Props, State> {
  state = getInitialState();
  handleClose = () => this.props.close();

  select = (id: string) => this.setState({ selectedDiagramId: id });

  render(): ReactPortal {
    const { show } = this.props;
    return createPortal(
      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {this.props.diagrams &&
              this.props.diagrams.map((value, index, array) => (
                <ListGroup.Item
                  key={value.id}
                  action
                  onClick={(event: any) => this.select(value.id)}
                  active={this.state.selectedDiagramId ? this.state.selectedDiagramId === value.id : false}
                >
                  {value.id}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleClose}>
            Load Diagram
          </Button>
        </Modal.Footer>
      </Modal>,
      document.body,
    );
  }
}

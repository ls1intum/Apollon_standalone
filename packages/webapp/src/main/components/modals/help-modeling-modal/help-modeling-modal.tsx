import React from 'react';
import { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createPortal } from 'react-dom';

type Props = {
  show: boolean;
  close: () => void;
};

type State = {};

export class HelpModelingModal extends Component<Props, State> {
  handleClose = () => {
    this.props.close();
  };

  render() {
    const { show } = this.props;
    return createPortal(
      <Modal aria-labelledby="contained-modal-title-vcenter" size="lg" centered show={show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>How to use this editor?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table">
            <tr>
              <th>Add Class</th>
              <td>
                To add a class, simply drag and drop one of the elements on the right side into the editor area on the
                left side.
              </td>
              <td>
                <img width="300" src="/images/help/help-create-element.png" alt='Image not found'/>
              </td>
            </tr>
            <tr>
              <th>Add Association</th>
              <td>
                To add an association, select the source class with a single click and you will see four blue circles.
                Those are the possible connection points for associations. Click and hold on one of those and drag it to
                another blue circle to create an association.
              </td>
              <td>
                <img width="300" src="/images/help/help-create-relationship.jpg" alt='Image not found'/>
              </td>
            </tr>
            <tr>
              <th>Edit Class</th>
              <td>
                To edit a class, double click it and a popup will open up, in which you can edit its components, e.g.
                name, attributes, methods, etc.
              </td>
              <td>
                <img width="300" src="/images/help/help-update-element.jpg" alt='Image not found'/>
              </td>
            </tr>
            <tr>
              <th>Delete Class</th>
              <td colSpan={2}>
                To delete a class, select it with a single click and either press <code>Delete</code> or{' '}
                <code>Backspace</code> on your keyboard.
              </td>
            </tr>
            <tr>
              <th>Move Class</th>
              <td>
                To move a class, select it with a single click and either use your keyboard arrows or drag and drop it.
              </td>
              <td>
                <img width="300" src="/images/help/help-move-element.jpg" alt='Image not found'/>
              </td>
            </tr>
            <tr>
              <th>Undo & Redo</th>
              <td colSpan={2}>
                With <code>Ctrl+Z</code> and <code>Ctrl+Y</code> you can undo and redo your changes.
              </td>
            </tr>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>,
      document.body,
    );
  }
}

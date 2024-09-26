import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { ThreeDots } from 'react-bootstrap-icons';
import { Dropdown } from 'react-bootstrap';

type OwnProps = {};

type State = {};

type StateProps = {};

type DispatchProps = {};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(null, {});

class VersionActionsMenuComponent extends Component<Props, State> {
  render() {
    return (
      <Dropdown id="version-actions-dropdown" drop="end">
        <Dropdown.Toggle as="div" variant="link">
          <ThreeDots />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Edit version info</Dropdown.Item>
          <Dropdown.Item>Preview version</Dropdown.Item>
          <Dropdown.Item>Restore version</Dropdown.Item>
          <Dropdown.Item>Delete version</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export const VersionActionsMenu = enhance(VersionActionsMenuComponent);

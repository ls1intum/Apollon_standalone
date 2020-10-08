import React, { Component } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { ApollonMode } from '@ls1intum/apollon';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store/application-state';
import { EditorOptionsRepository } from '../../../services/editor-options/editor-options-repository';

type OwnProps = {};

type State = {};

type StateProps = {
  mode: ApollonMode;
};

type DispatchProps = {
  changeMode: typeof EditorOptionsRepository.changeEditorMode;
};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => {
    return {
      mode: state.editorOptions.mode!,
    };
  },
  {
    changeMode: EditorOptionsRepository.changeEditorMode,
  },
);
class ViewMenuComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <>
        <NavDropdown id="file-menu-item" title="View" style={{ paddingTop: 0, paddingBottom: 0 }}>
          {Object.keys(ApollonMode).map((mode) => (
            <NavDropdown.Item
              key={mode}
              onClick={(event) => this.props.changeMode(ApollonMode[mode as keyof typeof ApollonMode])}
            >
              {mode}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </>
    );
  }
}

export const ViewMenu = enhance(ViewMenuComponent);

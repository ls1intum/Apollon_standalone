import React, { ChangeEvent, Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { FileMenu } from './menues/file-menu';
import { HelpMenu } from './menues/help-menu';
import { connect } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import { Diagram } from '../../services/local-storage/local-storage-types';
import styled from 'styled-components';
import { DiagramRepository } from '../../services/diagram/diagram-repository';
import { LocalStorageRepository } from '../../services/local-storage/local-storage-repository';
import { appVersion } from '../../application-constants';

type OwnProps = {};

type StateProps = {
  diagram: Diagram | null;
};

const DiagramTitle = styled.input`
  font-size: x-large;
  font-weight: bold;
  color: #fff;
  padding-left: 0.5rem;
  background-color: transparent;
  border: none;
`;

const ApplicationVersion = styled.span`
  font-size: small;
  color: #ccc;
  margin-right: 10px;
`;

type DispatchProps = {
  updateDiagram: typeof DiagramRepository.updateDiagram;
  store: typeof LocalStorageRepository.store;
};

type Props = OwnProps & StateProps & DispatchProps;

const enhance = connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  (state) => {
    return {
      diagram: state.diagram,
    };
  },
  {
    updateDiagram: DiagramRepository.updateDiagram,
    store: LocalStorageRepository.store,
  },
);

type State = { diagramTitle: string };

const getInitialState = (props: Props): State => {
  return {
    diagramTitle: props.diagram?.title ? props.diagram.title : '',
  };
};

class ApplicationBarComponent extends Component<Props, State> {
  state = getInitialState(this.props);

  constructor(props: Props) {
    super(props);
    this.changeDiagramTitlePreview = this.changeDiagramTitlePreview.bind(this);
    this.changeDiagramTitleApplicationState = this.changeDiagramTitleApplicationState.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if (this.props.diagram && prevProps.diagram?.title !== this.props.diagram?.title) {
      this.setState({ diagramTitle: this.props.diagram.title });
    }
  }

  changeDiagramTitlePreview(event: ChangeEvent<HTMLInputElement>) {
    // changes only diagram title of this component not in global state, this happens on blur
    this.setState({ diagramTitle: event.target.value });
  }

  changeDiagramTitleApplicationState(event: ChangeEvent<HTMLInputElement>) {
    if (this.props.diagram) {
      const diagram: Diagram = { ...this.props.diagram, title: this.state.diagramTitle };
      this.props.updateDiagram(diagram);
      this.props.store(diagram);
    }
  }

  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand>
            <img alt="" src="images/logo.png" width="60" height="30" className="d-inline-block align-top" />{' '}
            <span className="font-weight-bold ml-2">Apollon</span>
          </Navbar.Brand>
          <ApplicationVersion>{appVersion}</ApplicationVersion>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <FileMenu />
              <HelpMenu />
              <DiagramTitle
                type="text"
                value={this.state.diagramTitle}
                onChange={this.changeDiagramTitlePreview}
                onBlur={this.changeDiagramTitleApplicationState}
              />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}

export const ApplicationBar = enhance(ApplicationBarComponent);

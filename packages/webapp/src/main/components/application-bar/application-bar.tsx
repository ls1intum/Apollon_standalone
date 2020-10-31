import React, { ChangeEvent, Component, ComponentType } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { FileMenu } from './menues/file-menu';
import { HelpMenu } from './menues/help-menu';
import { connect, ConnectedComponent } from 'react-redux';
import { ApplicationState } from '../store/application-state';
import styled from 'styled-components';
import { DiagramRepository } from '../../services/diagram/diagram-repository';
import { appVersion } from '../../application-constants';
import { Diagram } from '../../services/diagram/diagram-types';
import { APPLICATION_SERVER_VERSION } from '../../constant';
import { ModalRepository } from '../../services/modal/modal-repository';
import { ModalContentType } from '../modals/application-modal-types';

type OwnProps = {};

type StateProps = {
  diagram: Diagram | null;
};

const DiagramTitle = styled.input`
  font-size: x-large;
  font-weight: bold;
  color: #fff;
  margin-left: 1rem;
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
  openModal: typeof ModalRepository.showModal;
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
    openModal: ModalRepository.showModal,
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
      this.props.updateDiagram({ title: this.state.diagramTitle });
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
              {/*<ViewMenu />*/}
              {APPLICATION_SERVER_VERSION && (
                <Nav.Item>
                  <Nav.Link onClick={(event: any) => this.props.openModal(ModalContentType.ShareModal, 'lg')}>
                    Share
                  </Nav.Link>
                </Nav.Item>
              )}
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

export const ApplicationBar: ConnectedComponent<ComponentType<Props>, OwnProps> = enhance(ApplicationBarComponent);

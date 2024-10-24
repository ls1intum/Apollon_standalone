import React, { ChangeEvent, useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { FileMenu } from './menues/file-menu';
import { HelpMenu } from './menues/help-menu';
import { ThemeSwitcherMenu } from './menues/theme-switcher-menu';
import styled from 'styled-components';
import { appVersion } from '../../application-constants';
import { APPLICATION_SERVER_VERSION } from '../../constant';
import { ModalContentType } from '../modals/application-modal-types';
import { ConnectClientsComponent } from './connected-clients-component';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateDiagramThunk } from '../../services/diagram/diagramSlice';
import { showModal } from '../../services/modal/modalSlice';

const DiagramTitle = styled.input`
  font-size: x-large;
  font-weight: bold;
  color: #fff;
  background-color: transparent;
  border: none;
`;

const ApplicationVersion = styled.span`
  font-size: small;
  color: #ccc;
  margin-right: 10px;
`;

export const ApplicationBar: React.FC = () => {
  const dispatch = useAppDispatch();

  const { diagram } = useAppSelector((state) => state.diagram);

  const [diagramTitle, setDiagramTitle] = useState<string>(diagram?.title || '');

  useEffect(() => {
    if (diagram?.title) {
      setDiagramTitle(diagram.title);
    }
  }, [diagram?.title]);

  const changeDiagramTitlePreview = (event: ChangeEvent<HTMLInputElement>) => {
    setDiagramTitle(event.target.value);
  };

  const changeDiagramTitleApplicationState = () => {
    if (diagram) {
      dispatch(updateDiagramThunk({ title: diagramTitle }));
    }
  };

  const handleOpenModal = () => {
    dispatch(showModal({ type: ModalContentType.ShareModal, size: 'lg' }));
  };

  return (
    <Navbar className="navbar" variant="dark" expand="lg">
      <Navbar.Brand>
        <img alt="" src="images/logo.png" width="60" height="30" className="d-inline-block align-top" />{' '}
        <span className="fw-bold ms-2">Apollon</span>
      </Navbar.Brand>
      <ApplicationVersion>{appVersion}</ApplicationVersion>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <FileMenu />
          {/*<ViewMenu />*/}
          {APPLICATION_SERVER_VERSION && (
            <Nav.Item>
              <Nav.Link onClick={handleOpenModal}>Share</Nav.Link>
            </Nav.Item>
          )}
          <HelpMenu />
          <DiagramTitle
            type="text"
            value={diagramTitle}
            onChange={changeDiagramTitlePreview}
            onBlur={changeDiagramTitleApplicationState}
          />
        </Nav>
        <ConnectClientsComponent />
      </Navbar.Collapse>
      <ThemeSwitcherMenu />
    </Navbar>
  );
};

import React, { Component } from 'react';
import { appVersion } from '../../application-constants';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FileMenu } from './menues/file-menu';

type Props = {};


export class ApplicationBarComponent extends Component<Props> {
  render() {
    return (
      <>
        <Navbar bg="dark" expand="lg">
          <Navbar.Brand href="#home">
            <img alt="" src="images/logo.png" width="60" height="30" className="d-inline-block align-top" /> Apollon{' '}
          </Navbar.Brand>
          {appVersion}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <FileMenu />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}

import React, { Component } from 'react';
import { appVersion } from '../../application-constants';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FileMenu } from './menues/file-menu';
import styled from 'styled-components';

const ApplicationVersion = styled.span`
  font-size: small;
  color: #ccc;
  margin-right: 10px;
`;

type Props = {};

export class ApplicationBarComponent extends Component<Props> {
  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand>
            <img alt="" src="images/logo.png" width="60" height="30" className="d-inline-block align-top" />{' '}
            <span className="font-weight-bold">Apollon</span>
          </Navbar.Brand>
          <ApplicationVersion>{appVersion}</ApplicationVersion>
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

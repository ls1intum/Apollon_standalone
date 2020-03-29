import React, { Component } from 'react';
import { appVersion } from '../../application-constants';
import { AppBarTitle, AppBarVersion, AppDetailContainer, AppLogo, Header } from './application-bar-styles';

type Props = {};

export class ApplicationBarComponent extends Component<Props> {
  render() {
    return (
      <Header>
        <AppDetailContainer>
          <AppLogo src="images/logo.png" />
          <AppBarTitle>Apollon</AppBarTitle>
          <AppBarVersion>{appVersion}</AppBarVersion>
        </AppDetailContainer>
      </Header>
    );
  }
}

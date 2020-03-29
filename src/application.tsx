import React from 'react';
import { ApplicationBarComponent } from './components/application-bar/application-bar';
import { ApollonEditorComponent } from './components/apollon-editor-component/apollon-editor-component';
import { ApollonOptions } from '@ls1intum/apollon';
import { createGlobalStyle } from 'styled-components';

const options: ApollonOptions = {
  model: JSON.parse(window.localStorage.getItem('apollon')!),
};

const GlobalStyle = createGlobalStyle`
  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
         Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 0;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`;

export class Application extends React.Component {
  render() {
    return (
      <>
        <GlobalStyle />
        <ApplicationBarComponent />
        <ApollonEditorComponent options={options} />
      </>
    );
  }
}

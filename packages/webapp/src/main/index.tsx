import React from 'react';
import ReactDOM from 'react-dom';
import { RoutedApplication } from './application';
import { switchTheme } from './utils/theme-switcher';

import './styles.css';

switchTheme('light'); // TODO: Set from cache/localstorage/system
ReactDOM.render(<RoutedApplication />, document.getElementById('root') as HTMLElement);

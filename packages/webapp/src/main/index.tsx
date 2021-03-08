import React from 'react';
import ReactDOM from 'react-dom';
import { RoutedApplication } from './application';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenFancy } from '@fortawesome/free-solid-svg-icons';

import './styles.css';
library.add(faPenFancy);

ReactDOM.render(<RoutedApplication />, document.getElementById('root') as HTMLElement);

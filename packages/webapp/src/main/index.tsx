import React from 'react';
import ReactDOM from 'react-dom';
import { RoutedApplication } from './application';
import { setTheme } from './utils/theme-switcher';
import { LocalStorageRepository } from '../main/services/local-storage/local-storage-repository';

import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';

const themePreference: string | null = LocalStorageRepository.getUserThemePreference();

if (!themePreference) {
  // Get from System Dark/Mode theme preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Dark mode
    LocalStorageRepository.setSystemThemePreference('dark');
    setTheme('dark');
  } else {
    // Light Mode
    LocalStorageRepository.setSystemThemePreference('light');
    setTheme('light');
  }
} else {
  setTheme(themePreference);
}

ReactDOM.render(<RoutedApplication />, document.getElementById('root') as HTMLElement);

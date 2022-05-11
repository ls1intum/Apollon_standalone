import React from 'react';
import ReactDOM from 'react-dom';
import { RoutedApplication } from './application';
import { setTheme } from './utils/theme-switcher';
import { localStorageSystemTheme, localStorageThemePreference } from './constant';

import './styles.css';

const themePreference: string | null = window.localStorage.getItem(localStorageThemePreference);

if (!themePreference) {
  // Get from System Dark/Mode theme preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Dark mode
    window.localStorage.setItem(localStorageSystemTheme, 'DARK');
    setTheme('dark');
  } else {
    // Light Mode
    window.localStorage.setItem(localStorageSystemTheme, 'LIGHT');
    setTheme('light');
  }
} else {
  setTheme(themePreference.toLowerCase());
}

ReactDOM.render(<RoutedApplication />, document.getElementById('root') as HTMLElement);

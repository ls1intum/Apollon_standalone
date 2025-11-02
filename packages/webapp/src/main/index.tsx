import React from 'react';
import { RoutedApplication } from './application';
import { setTheme } from './utils/theme-switcher';
import { LocalStorageRepository } from '../main/services/local-storage/local-storage-repository';
import { createRoot } from 'react-dom/client';

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

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<RoutedApplication />);

import { LocalStorageRepository } from '../../main/services/local-storage/local-storage-repository';
import themingsJson from '../themings.json';

type ThemeMap = Record<string, Record<string, string>>;

const themings = themingsJson as ThemeMap;

export const setTheme = (theming: string) => {
  const root = document.documentElement;
  const theme = themings[theming];

  if (!theme) {
    return;
  }

  for (const [themingVar, value] of Object.entries(theme)) {
    root.style.setProperty(themingVar, value);
  }
};

export const toggleTheme = () => {
  let themePreference = LocalStorageRepository.getUserThemePreference();
  if (!themePreference) themePreference = LocalStorageRepository.getSystemThemePreference();

  switch (themePreference) {
    case 'dark':
      setTheme('light');
      LocalStorageRepository.setUserThemePreference('light');
      break;

    default:
      setTheme('dark');
      LocalStorageRepository.setUserThemePreference('dark');
      break;
  }
};

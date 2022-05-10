import { localStorageThemePreference } from '../constant';
import * as themings from '../themings.json';

export const setTheme = (theming: string) => {
    const root = document.documentElement;
    // @ts-ignore
    for (const themingVar of Object.keys(themings[theming])) {
        // @ts-ignore
        root.style.setProperty(themingVar, themings[theming][themingVar]);
    }
};

export const toggletheme = () => {
    const themePreference = window.localStorage.getItem(localStorageThemePreference);

    switch (themePreference) {
        case 'DARK':
            setTheme('light');
            window.localStorage.setItem(localStorageThemePreference, 'LIGHT');
            break;
    
        default:
            setTheme('dark');
            window.localStorage.setItem(localStorageThemePreference, 'DARK');
            break;
    }

};
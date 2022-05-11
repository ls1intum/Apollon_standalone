import { localStorageSystemTheme, localStorageThemePreference } from '../constant';
import * as themings from '../themings.json';

export const setTheme = (theming: string) => {
    const root = document.documentElement;
    // @ts-ignore
    for (const themingVar of Object.keys(themings[theming])) {
        // @ts-ignore
        root.style.setProperty(themingVar, themings[theming][themingVar]);
    }
};

export const toggleTheme = () => {
    let themePreference = window.localStorage.getItem(localStorageThemePreference);
    if(!themePreference) themePreference = window.localStorage.getItem(localStorageSystemTheme);


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
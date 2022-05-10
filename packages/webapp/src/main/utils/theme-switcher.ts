import * as themings from '../themings.json';

export const switchTheme = (theming: string) => {
    const root = document.documentElement;
    // @ts-ignore
    for (const themingVar of Object.keys(themings[theming])) {
        // @ts-ignore
        root.style.setProperty(themingVar, themings[theming][themingVar]);
    }
};
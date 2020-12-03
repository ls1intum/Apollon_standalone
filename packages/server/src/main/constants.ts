import path from 'path';

console.log(path.resolve(__dirname, `../../../../build/webapp`));
export const webappPath = path.resolve(__dirname, `../../../../build/webapp`);
console.log(path.resolve(`${webappPath}/index.html`));
console.log(path.resolve(`/home/f4ll3n/tum/master_thesis/apollon_standalone/build/webapp/index.html`));
export const indexHtml = path.resolve(`/home/f4ll3n/tum/master_thesis/apollon_standalone/build/webapp/index.html`);

export const diagramStoragePath = path.resolve(__dirname, `../../../../diagrams`);

export const tokenLength = 20;

import path from 'path';
import { fileURLToPath } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const webappPath = path.resolve(currentDir, '../../../../build/webapp');
export const indexHtml = path.resolve(webappPath, './index.html');

export const diagramStoragePath = path.resolve(currentDir, '../../../../diagrams');

export const tokenLength = 20;

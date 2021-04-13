// webpack environment constants
export const APPLICATION_SERVER_VERSION = process.env.APPLICATION_SERVER_VERSION;
export const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL;
export const BASE_URL = `${DEPLOYMENT_URL}/api`;

// prefixes
export const localStoragePrefix = 'apollon_';
export const localStorageDiagramPrefix = localStoragePrefix + 'diagram_';

// keys
export const localStorageDiagramsList = localStoragePrefix + 'diagrams';
export const localStorageLatest = localStoragePrefix + 'latest';
export const localStorageCollaborationName = localStoragePrefix + 'collaborationName';
// date formats
export const longDate = 'MMMM Do YYYY, h:mm:ss a';

// toast hide duration in ms
export const toastAutohideDelay = 2000;

// bug report url
export const bugReportURL = 'https://github.com/ls1intum/Apollon/issues/new?labels=bug&template=bug-report.md';

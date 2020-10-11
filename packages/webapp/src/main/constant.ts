// webpack environment constants
declare const APPLICATION_SERVER_VERSION: boolean;
const _applicationServerVersion = APPLICATION_SERVER_VERSION;
export { _applicationServerVersion as APPLICATION_SERVER_VERSION };

declare const DEPLOYMENT_URL: string;
const _deploymentURL = DEPLOYMENT_URL;
export { _deploymentURL as DEPLOYMENT_URL };

export const BASE_URL = `${DEPLOYMENT_URL}/api`;

// prefixes
export const localStoragePrefix = 'apollon_';
export const localStorageDiagramPrefix = localStoragePrefix + 'diagram_';

// keys
export const localStorageDiagramsList = localStoragePrefix + 'diagrams';
export const localStorageLatest = localStoragePrefix + 'latest';

// date formats
export const longDate = 'MMMM Do YYYY, h:mm:ss a';

// toast hide duration in ms
export const toastAutohideDelay = 2000;

// bug report url
export const bugReportURL = 'https://github.com/ls1intum/Apollon/issues/new?labels=bug&template=bug-report.md';

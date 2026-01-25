import path from 'path';

const argvDir = process.argv[1] ? path.dirname(path.resolve(process.argv[1])) : '';
const cwd = process.cwd();
const baseDirCandidates = [argvDir, cwd].filter(Boolean);

let baseDir = cwd;
for (const candidate of baseDirCandidates) {
  const normalized = path.normalize(candidate);
  if (normalized.endsWith(path.join('build', 'server'))) {
    baseDir = path.resolve(candidate, '..', '..');
    break;
  }
  if (normalized.endsWith(path.join('packages', 'server'))) {
    baseDir = path.resolve(candidate, '..', '..');
    break;
  }
}

const rootDir = process.env.APOLLON_BASE_DIR ? path.resolve(process.env.APOLLON_BASE_DIR) : baseDir;

export const webappPath = path.resolve(rootDir, 'build/webapp');
export const indexHtml = path.resolve(webappPath, 'index.html');

export const diagramStoragePath = path.resolve(rootDir, 'diagrams');

export const tokenLength = 20;

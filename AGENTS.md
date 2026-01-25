# Repository Guidelines

## Project Structure & Module Organization
- `packages/shared`: shared TypeScript types/utilities, built to `packages/shared/dist`.
- `packages/server`: Node/Express application in `packages/server/src`, bundled to `build/server`.
- `packages/webapp`: React UI in `packages/webapp/src` with static assets in `packages/webapp/assets`, bundled to `build/webapp`.
- `docs/`: product docs and images; `build/`: generated artifacts.

## Build, Test, and Development Commands
```bash
npm install                       # install workspace dependencies
npm start                         # webapp dev server + server (concurrently)
npm run build                     # build shared, webapp, and server
npm run build:local               # build with local deployment URL
npm run lint                      # eslint for server + webapp
npm run test                      # vitest for server + webapp
npm run test:watch --workspace=webapp
npm run test:coverage --workspace=server
```
For webapp-only builds set `APPLICATION_SERVER_VERSION=0`. For full builds set `APPLICATION_SERVER_VERSION=1` and `DEPLOYMENT_URL=<server-url>`.

## Coding Style & Naming Conventions
- TypeScript-first codebase; prefer explicit types and `const` where possible.
- Formatting is handled by Prettier (`.prettierrc`: print width 120, single quotes, trailing commas). Use `npm run prettier:write` when needed.
- Linting via ESLint (`packages/*/.eslintrc.cjs`) and Stylelint for styled-components (`npm run lint:css --workspace=webapp`).

## Testing Guidelines
- Vitest is used in `packages/server` and `packages/webapp` (`packages/*/vitest.config.ts`).
- Tests live under `packages/server/src/tests` and `packages/webapp/src/tests` and use `*.test.ts` / `*.test.tsx` naming.
- Run coverage with `npm run test:coverage --workspace=webapp` or `--workspace=server`.

## Commit & Pull Request Guidelines
- Recent history follows Conventional Commit-style prefixes (e.g., `fix: ...`, `chore(deps): ...`). Keep subject lines short and imperative.
- PRs should include a concise summary, test commands run, and link any relevant issues. Include screenshots or GIFs for UI changes in `packages/webapp`.

## Configuration & Runtime Notes
- Node `>=24.7.0` and npm `>=11.5.1` are required.
- Redis support is optional via `APOLLON_REDIS_URL` (and `APOLLON_REDIS_DIAGRAM_TTL`); server defaults to local Redis when empty.
- The server stores shared diagrams on disk; create a `diagrams/` directory for local development.

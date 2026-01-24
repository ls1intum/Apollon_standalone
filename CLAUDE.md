# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Apollon Standalone is a web-based UML diagram editor built on top of the [Apollon Editor library](https://github.com/ls1intum/Apollon). It can run as a static web application or with an application server that enables diagram sharing and real-time collaboration.

## Build Commands

```bash
# Install dependencies
npm install

# Development (starts both webapp and server with hot reload)
npm start

# Build for local development
npm run build:local

# Build for production (requires APPLICATION_SERVER_VERSION and DEPLOYMENT_URL env vars)
npm run build

# Build only webapp (static-only mode)
APPLICATION_SERVER_VERSION=0 npm run build:webapp

# Build only server
npm run build:server

# Lint all packages
npm run lint

# Format code
npm run prettier:write
npm run prettier:check
```

## Architecture

### Monorepo Structure (npm workspaces)

- **packages/shared/** - Shared TypeScript types and DTOs used by both webapp and server
- **packages/webapp/** - React web application with user interface
- **packages/server/** - Express.js server

### Webapp Architecture

React application using:
- **Redux Toolkit** for state management with slices in `packages/webapp/src/main/services/*/`
- **React Router** for routing (`/` for new diagrams, `/:token` for shared diagrams)
- **styled-components** for CSS-in-JS styling
- **@ls1intum/apollon** - The core diagram editor library

Key state slices:
- `diagramSlice` - Current diagram state
- `shareSlice` - Sharing/collaboration state
- `versionManagementSlice` - Version history
- `modalSlice` - Modal dialogs
- `errorManagementSlice` - Error handling

Entry point: `packages/webapp/src/main/application.tsx`

### Server Architecture

Express.js server providing:
- **REST API** at `/api/` for diagram CRUD operations
- **WebSocket** for real-time collaboration
- **PDF conversion** using pdfmake and canvas

Key services:
- `CollaborationService` - WebSocket-based real-time collaboration
- `DiagramStorageService` - Diagram persistence (filesystem or Redis)
- `ConversionService` - SVG to PDF conversion

Storage:
- File system (default): diagrams stored in `diagrams/` directory
- Redis: Set `APOLLON_REDIS_URL` environment variable

Entry point: `packages/server/src/main/server.ts`

### Shared Package

Contains DTOs shared between webapp and server:
- `DiagramDTO` - Diagram data transfer object
- `Collaborator` - Collaboration user info
- `SelectionChange` - Real-time selection sync

## Environment Variables

- `APPLICATION_SERVER_VERSION` - Set to `1` to enable server features, `0` for static-only
- `DEPLOYMENT_URL` - Production URL (e.g., `https://apollon.ase.in.tum.de`)
- `APOLLON_REDIS_URL` - Redis connection URL (enables Redis storage)
- `APOLLON_REDIS_DIAGRAM_TTL` - TTL for Redis diagrams (e.g., `30d`)

## Development with Local Apollon

To test changes to the Apollon library locally:
1. In Apollon project: `npm link`
2. In this project: `npm link "@ls1intum/apollon"`
3. After Apollon changes: `npm run prepare` in Apollon, then `npm run build` here

## Running with Redis (Development)

```bash
docker run -p 6379:6379 -it redis/redis-stack-server:latest
APOLLON_REDIS_URL="" npm start
```

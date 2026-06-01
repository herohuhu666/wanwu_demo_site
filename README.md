# Wanwu Demo Site

Wanwu Demo Site is a full-stack interactive demo for the Wanwu App experience. It combines a React/Vite frontend, an Express/tRPC backend, Drizzle database schema, S3-compatible uploads, and Qwen text/vision workflows to prototype multimodal AI product interactions.

The project explores a "Digital Zen" product direction: calm UI, ritual-style interactions, AI-assisted interpretation, status tracking, check-in loops, and membership-gated experiences.

## Features

- Interactive app-style frontend built with React, Vite, Tailwind CSS, Radix UI, and shadcn-style components
- Express backend with tRPC routes and shared TypeScript types
- Drizzle ORM schema and migration setup
- Qwen text and vision API integration for AI chat and image interpretation flows
- S3-compatible image upload support
- AI modules for Lingxi chat, divination interpretation, image-based analysis, check-ins, status records, and knowledge library experiences
- Test scripts for backend auth and Qwen integration flows

## Tech Stack

- Frontend: React 19, Vite, TypeScript, Tailwind CSS, Radix UI, Framer Motion
- Backend: Express, tRPC, Zod, SuperJSON
- Data: Drizzle ORM, MySQL-compatible database
- AI: Qwen text and vision workflows
- Storage: S3-compatible object storage
- Tooling: pnpm, Vitest, Prettier, esbuild

## Getting Started

### Prerequisites

- Node.js 24 or newer
- pnpm 10
- A MySQL-compatible database
- Optional: Qwen API credentials and S3-compatible storage credentials for AI/image upload features

### Install

```bash
pnpm install
```

### Configure Environment

Create a local `.env` file based on the variables used by the server configuration. At minimum, configure database access before running migrations or backend features.

Common runtime areas include:

- database connection
- Qwen API credentials
- S3-compatible storage credentials
- application/session secrets

Do not commit real secrets to the repository.

### Development

```bash
pnpm dev
```

### Type Check

```bash
pnpm check
```

### Tests

```bash
pnpm test
```

### Build

```bash
pnpm build
```

### Database

```bash
pnpm db:push
```

## Project Structure

```text
client/          React/Vite frontend
server/          Express, tRPC, AI, upload, and backend integration code
shared/          Shared constants, types, and errors
drizzle/         Database schema, relations, and migrations
patches/         Package patches used by pnpm
```

## Maintenance Focus

Current maintenance work focuses on:

- improving AI prompt reliability and response quality
- hardening upload and API route behavior
- adding tests around backend integrations
- documenting local setup and deployment requirements
- improving TypeScript coverage and shared API contracts
- making the demo easier for other developers to run and extend

## Contributing

Issues and pull requests are welcome. Please read `CONTRIBUTING.md` before proposing changes.

## Security

Please do not open public issues for security-sensitive reports. See `SECURITY.md` for the disclosure process.

## License

MIT License. See `LICENSE`.

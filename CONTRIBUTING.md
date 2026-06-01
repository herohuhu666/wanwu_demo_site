# Contributing to Wanwu Demo Site

Thanks for your interest in contributing.

## Good First Contributions

Useful contribution areas include:

- improving setup documentation
- adding tests for backend routes and AI integration wrappers
- improving TypeScript types shared between client and server
- fixing UI bugs in mobile layouts
- improving accessibility and keyboard behavior
- documenting environment variables and deployment notes

## Development Workflow

1. Fork the repository.
2. Create a feature branch.
3. Install dependencies with `pnpm install`.
4. Run checks before submitting:

```bash
pnpm check
pnpm test
```

5. Open a pull request with a clear summary and screenshots or logs when useful.

## Pull Request Guidelines

- Keep changes focused and easy to review.
- Do not commit secrets, local `.env` files, generated credentials, or private user data.
- Include tests for backend logic when possible.
- For UI changes, include screenshots or a short screen recording.
- For AI prompt or API changes, describe the expected behavior change and failure mode.

## Issue Guidelines

When opening an issue, include:

- what you expected to happen
- what happened instead
- reproduction steps
- browser/runtime version when relevant
- screenshots, logs, or stack traces when useful

## Code Style

Use the existing TypeScript, React, and server patterns in the repository. Run Prettier before large formatting-sensitive changes:

```bash
pnpm format
```

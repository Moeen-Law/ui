# Repository Guidelines

## Project Structure & Module Organization

This is a Vite React 19 + TypeScript frontend for the Moeen law platform. Application code lives in `src/`. Use `src/features/` for domain modules such as `auth`, `chat`, and `landing`; each feature groups its `components`, `hooks`, `pages`, `services`, `store`, `types`, and schemas. Shared code belongs in `src/shared/`, UI primitives in `src/components/ui/`, setup in `src/lib/`, routes in `src/routes/`, and translations in `src/locales/ar` and `src/locales/en`. Static assets live in `public/`; `dist/` is generated. `desired-ui/` and `sse-guide/` are reference/support folders.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local Vite development server.
- `npm run build`: run TypeScript builds and produce the production bundle.
- `npm run lint`: run ESLint across the repository.
- `npm run preview`: serve the production build locally for smoke testing.
- `npm run docker:build` / `npm run docker:push`: build and publish the configured registry image.

## Coding Style & Naming Conventions

Write TypeScript and React function components. Keep feature-specific code inside its feature folder. Use PascalCase for component files and exports, for example `AuthLayout.tsx`; use camelCase for functions, variables, hooks, and stores, with hooks starting with `use`. Prefer configured path aliases when available. ESLint is configured in `eslint.config.js` with TypeScript, React Hooks, and React Refresh rules; run `npm run lint` before submitting changes.

## Testing Guidelines

There is currently no `npm test` script or dedicated test framework. For now, validate changes with `npm run lint`, `npm run build`, and manual browser checks through `npm run dev` or `npm run preview`. If adding tests, place them near the code they cover, name files `*.test.ts` or `*.test.tsx`, and add the matching npm script in `package.json`.

## Commit & Pull Request Guidelines

Recent history uses short, imperative messages, often Conventional Commit prefixes such as `feat:` and `fix:`. Keep commits focused, for example `fix: translation issues in pricing section`. Pull requests should include a summary, linked issue or task, screenshots for UI changes, environment notes, and lint/build results.

## Security & Configuration Tips

Copy `.env.example` to `.env` and set `VITE_BASE_URL` for the target API. Do not commit secrets, certificates, tokens, or local-only configuration. Treat Docker, Nginx, and Woodpecker changes as deployment-impacting and document required follow-up in the PR.

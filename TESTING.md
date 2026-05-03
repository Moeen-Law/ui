# Testing

This project uses a layered test setup:

- `Vitest` for unit and component tests.
- `React Testing Library` and `user-event` for user-facing component behavior.
- `MSW` for HTTP mocking in Vitest.
- `Playwright` for critical browser journeys.

## Commands

```bash
npm test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
```

## Test Layout

- Place unit/component tests beside the code they cover with `*.test.ts` or `*.test.tsx`.
- Put browser-level tests in `e2e/`.
- Use `src/test/render.tsx` for React components that need router, React Query, and direction providers.
- Use `src/test/handlers.ts` for shared MSW endpoint mocks.

## Current Priority Areas

- Auth: schemas, store behavior, login form, protected routing.
- Chat: file upload services, stream payload parsing, markdown normalization, composer file selection.
- E2E: unauthenticated redirect, login, authenticated chat access.

## Notes

Tests should not call real Moeen services. Add or override MSW/Playwright route handlers for every backend interaction that a test triggers.


# Moeen UI

Frontend for the Moeen law platform. The app is an Arabic-first legal AI workspace built with React, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, React Router, and shadcn-style UI primitives.

<p align="center">
  <img src="./public/brand/brand.png" alt="Moeen Law" width="100%" />
</p>

## Overview

Moeen UI provides the public landing experience, authentication, subscription upgrade flow, AI chat, legal task tools, and an admin dashboard for platform operations. The application is localized in Arabic and English, supports RTL/LTR direction switching, and is prepared for production deployment with Docker and Nginx.

## Core Features

- Public landing page with pricing, FAQ, demo, feature, and about sections.
- Email/password authentication, Google OAuth callback handling, email verification, forgot password, reset password, logout, and session management.
- Protected user workspace routes backed by access-token storage and refresh-token-aware API handling.
- Admin-only dashboard route protected by role checks.
- AI chat with chat history, search, streaming responses, stop-generation support, Markdown rendering, file upload support, and daily quota UI.
- Legal terminology lookup with saved history.
- Government process assistant with saved history and source display.
- Contract analysis workflow with file upload, task history, source display, and detail routes.
- Document generation workflow with templates, dynamic fields, generated file history, and downloadable generated documents.
- Subscription plans, upgrade flow, payment handoff, and payment-result page.
- Admin analytics for users, chats, document usage, subscriptions, payments, failed payments, stuck payments, and top paying users.
- Responsive desktop and mobile navigation, shared tools dialog, theme toggle, language toggle, and toast notifications.

## Tech Stack

- React 19 and TypeScript 5
- Vite 7 with manual vendor chunking
- React Router 7
- TanStack Query 5
- Zustand with persisted auth state
- Tailwind CSS 4 and `@tailwindcss/vite`
- shadcn-style primitives, Radix UI, Base UI, Vaul, CMDK, Sonner, and Lucide icons
- React Hook Form and Zod
- i18next and react-i18next
- Axios and `@microsoft/fetch-event-source`
- Recharts for admin charts
- React Markdown and remark-gfm
- Vitest, React Testing Library, jsdom, MSW, and Playwright
- Docker and Nginx for production serving

## Project Structure

```text
src/
  App.tsx                         Main router and route protection wiring
  main.tsx                        React entry point
  index.css                       Global Tailwind/theme styles

  assets/                         Static assets imported from TypeScript
  components/ui/                  Shared UI primitives
  lib/                            App-level utilities and i18n setup
  locales/
    ar/translation.json           Arabic translations
    en/translation.json           English translations
  routes/                         Route guards and route tests
  shared/
    api/                          Axios client, refresh handling, request wrapper
    components/                   Cross-feature components
    constants/                    Shared navigation/tool constants
    hooks/                        Shared hooks
    pages/                        Shared route pages such as NotFound
    store/                        Shared UI stores
    types/                        Shared TypeScript types
    utils/                        Shared utilities
  test/                           Vitest setup, MSW handlers, render helpers

  features/
    admin/                        Admin layout, users, chats, and payments analytics
    auth/                         Auth pages, hooks, schemas, services, store, helpers
    chat/                         Chat UI, SSE streaming, history, files, quota
    contract-analysis/            Contract analysis task workflow
    document-generation/          Template-based document generation workflow
    government-processes/         Government process assistant workflow
    landing/                      Public marketing and pricing page
    legal-terminologies/          Legal terminology lookup workflow
    plans/                        Plans, subscriptions, upgrade, payment result
```

Other folders and files:

- `public/`: assets served directly by Vite, including brand images and icons.
- `admin-guide/`: admin-related reference screenshot.
- `payment-guide/`: payment-related reference image.
- `scripts/`: support scripts, including bundle-size reporting.
- `dist/`: generated production build output.
- `Dockerfile`: multi-stage production image build.
- `nginx.conf`: non-root Nginx SPA serving config.
- `TESTING.md`: additional testing notes.
- `.woodpecker.yaml`: CI/deployment pipeline configuration.

## Routes

Public and guest routes:

- `/`: landing page.
- `/signup`: sign up.
- `/login`: login.
- `/forgot-password`: forgot password.
- `/reset-password`: reset password.
- `/verify-email`: email verification.
- `/login/oauth/authorize`: OAuth callback handling.
- `/payment-result`: payment status/result page.

Authenticated user routes:

- `/upgrade`: plan upgrade and subscription purchase flow.
- `/chat`: chat workspace.
- `/chat/:chatId`: specific chat.
- `/legal-terminologies`: legal terminology tool.
- `/government-processes`: government process tool.
- `/contract-analysis`: contract analysis tool.
- `/contract-analysis/:analysisId`: saved contract analysis detail.
- `/document-generation`: document generation tool.

Admin routes:

- `/admin`: admin users dashboard.
- `/admin/chats`: admin chat analytics.
- `/admin/subscriptions`: admin payments and subscription analytics.

Unknown routes fall through to the shared not-found page.

## Route Protection

- `GuestOnlyRoute` keeps authenticated users out of guest-only auth pages.
- `ProtectedRoute` protects normal user workspace pages.
- `AdminRoute` protects `/admin` routes by checking the persisted access token and the current profile roles.
- Unauthenticated users attempting to open `/admin` are redirected to `/` with `replace`, so login does not send them back to the admin route.
- Authenticated non-admin users attempting to open `/admin` are redirected to `/chat`.
- Admin navigation is exposed only when the current profile has the `ADMIN` role.

## Backend Integration

The API client is defined in `src/shared/api/index.ts`.

- Base URL comes from `VITE_BASE_URL`.
- Requests include credentials for cookie-based refresh-token flows.
- Access tokens are stored in the persisted Zustand auth store.
- The Axios request interceptor attaches `Authorization: Bearer <token>`.
- The response interceptor handles one 401 retry through `/auth/api/v1/auth/refresh`.
- Refresh failures clear the local access token and redirect to `/`.

Service path groups:

- Auth: `/auth/api/v1`
- Chat and AI tasks: `/chats/api/v1`
- Subscriptions: `/subscriptions/api/v1`
- Payments: `/payment/api/v1`
- Admin: `/admin/api/v1`

## Getting Started

### Prerequisites

- Node.js 22 is recommended because the Docker build uses `node:22-alpine`.
- npm.

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and set the API gateway URL.

```env
VITE_BASE_URL=https://gateway.moeenlaw.com
```

The local Vite config also supports HTTPS when these certificate files exist in the project root:

- `dev.moeenlaw.com+2-key.pem`
- `dev.moeenlaw.com+2.pem`

## Development Commands

```bash
npm run dev
npm run build
npm run build:analyze
npm run lint
npm test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
npm run preview
```

Command details:

- `npm run dev`: start Vite on port `5173`.
- `npm run build`: run TypeScript project build and Vite production build.
- `npm run build:analyze`: build and report bundle size.
- `npm run lint`: run ESLint across the repository.
- `npm test`: run Vitest once.
- `npm run test:watch`: run Vitest in watch mode.
- `npm run test:coverage`: run Vitest with V8 coverage output in `coverage/`.
- `npm run test:e2e`: run Playwright tests.
- `npm run test:e2e:ui`: open the Playwright test UI.
- `npm run preview`: serve the generated production bundle locally.
- `npm run docker:build`: build `registry.moeenlaw.com/ui:latest`.
- `npm run docker:push`: push `registry.moeenlaw.com/ui:latest`.

## Testing

Unit and component tests live beside the code they cover with `*.test.ts` and `*.test.tsx` names. Shared test setup is in `src/test/`.

- `src/test/setup.ts`: jest-dom, cleanup, i18n reset, auth-store reset, browser API mocks, and MSW lifecycle.
- `src/test/handlers.ts`: shared mocked backend handlers.
- `src/test/render.tsx`: render helper with providers.
- `vitest.config.ts`: jsdom environment, global setup, aliases, CSS support, and coverage configuration.
- `playwright.config.ts`: browser test configuration using `https://127.0.0.1:5173` and reusing an existing dev server when available.

Before submitting changes, run:

```bash
npm run lint
npm run build
npm test
```

Use Playwright for browser-level workflows when a change affects routing, auth, navigation, or responsive behavior.

## Deployment

The production image uses a two-stage Docker build:

1. Build stage: installs dependencies with `npm ci --ignore-scripts` and runs `npm run build`.
2. Runtime stage: serves `dist/` from Nginx on port `8080` as a non-root user.

Build and run locally:

```bash
docker build -t moeen-ui .
docker run -p 8080:8080 moeen-ui
```

The Nginx config includes SPA fallback routing, static asset caching, gzip compression, hidden-file denial, security headers, and a limited method policy for static serving.

## Coding Guidelines

- Keep feature-specific code inside `src/features/<feature>/`.
- Put reusable cross-feature code in `src/shared/`.
- Put UI primitives in `src/components/ui/`.
- Put route guards and route-level tests in `src/routes/`.
- Put Arabic and English copy in `src/locales/ar/translation.json` and `src/locales/en/translation.json`.
- Use PascalCase for React component files and exports.
- Use camelCase for variables, functions, stores, and hooks.
- Prefix hooks with `use`.
- Prefer the `@/` alias for imports from `src`.
- Keep generated output such as `dist/` and `coverage/` out of manual edits.

## Security and Configuration

- Do not commit secrets, tokens, private certificates, or local-only configuration.
- Keep environment values in `.env`.
- Treat changes to `Dockerfile`, `nginx.conf`, and `.woodpecker.yaml` as deployment-impacting.
- Access control in the UI is not a replacement for backend authorization; admin APIs must still enforce admin permissions server-side.

## License

This project is private and unlicensed for public redistribution.

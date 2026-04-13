# QWEN.md — Moeen UI Context

## Project Overview

**Moeen (مُعين)** is an Egyptian legal AI platform graduation project. The frontend (`moeen-ui`) is a React 19 + TypeScript SPA that provides features like user authentication (JWT, OAuth), an AI-powered chat interface for legal consultation, and a polished landing page. The UI is designed with Arabic RTL support, using the Cairo font, Tailwind CSS 4, Shadcn UI, and Framer Motion for animations.

### Architecture

The project follows a **Feature-Based Module System**:

```
src/
├── assets/          # Images and media
├── components/      # Shared components & Shadcn UI components
├── features/        # Feature modules (auth, chat, landing)
│   ├── auth/        # Authentication logic, stores, pages
│   ├── chat/        # AI chat system components & pages
│   └── landing/     # Landing page components & pages
├── lib/             # External library configurations
├── routes/          # Route guards and route definitions
├── shared/          # Shared hooks, utils, types, constants, API clients
├── test/            # Test files
├── App.tsx          # Main app with routing
├── index.css        # Global styles
└── main.tsx         # Entry point
```

### Tech Stack

| Area | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS 4 + Shadcn UI (Radix-based) |
| State Management | Zustand |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Routing | React Router 7 |
| HTTP Requests | Axios |
| Data Fetching | @tanstack/react-query |
| Icons | Lucide React |
| Build Tool | Vite 7 |
| Linting | ESLint 9 |

## Building and Running

### Prerequisites

- Node.js v18+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### Docker

```bash
# Build image
npm run docker:build
# or: docker build -t moeen-ui .

# Push to registry
npm run docker:push

# Run container
docker run -p 80:8080 moeen-ui
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_BASE_URL=https://gateway.moeenlaw.com
```

## CI/CD

The project uses **Woodpecker CI** (`.woodpecker.yaml`) with the following pipeline:

1. **version** — Reads version from `package.json` and writes `.tags`
2. **create-env** — Injects `.env` from CI secrets
3. **build-and-push** — Builds Docker image and pushes to `registry.moeenlaw.com/ui`
4. **notify-success/failure** — Discord notifications via webhook

Pipeline triggers: `push`, `manual`, or `cron` on the `main` branch.

## Key Conventions

- **TypeScript** throughout; strict mode enabled via `tsconfig.app.json` and `tsconfig.node.json`
- **Feature-based organization** — each feature (auth, chat, landing) is self-contained in `src/features/`
- **Shadcn UI** — components are managed via `components.json` config; UI components live in `src/components/ui`
- **RTL-first** — the app uses `DirectionProvider` with `dir="rtl"` for Arabic support
- **Path alias** — `@` resolves to `./src` (configured in `vite.config.ts`)
- **Lazy loading** — the Chat page is lazy-loaded with `React.lazy` and wrapped in `Suspense`
- **Protected routes** — auth-gated routes use a `ProtectedRoute` wrapper
- **Error boundaries** — `ErrorBoundary` components wrap critical sections

## Notable Files

| File | Purpose |
|---|---|
| `vite.config.ts` | Vite config with React plugin, Tailwind CSS plugin, path alias, optional HTTPS dev certs |
| `Dockerfile` | Multi-stage build: Node 22 Alpine for build, Nginx 1.27 Alpine for serving |
| `nginx.conf` | Production Nginx config: SPA routing, gzip compression, security headers, 1-year cache for hashed assets |
| `components.json` | Shadcn UI configuration (radix-nova style, RTL enabled) |
| `package.json` | Dependencies, scripts, Docker shortcuts |
| `.woodpecker.yaml` | CI/CD pipeline definition |
| `src/App.tsx` | Main app: React Query provider, React Router routes, auth redirects |
| `src/main.tsx` | Entry point: StrictMode, ErrorBoundary, DirectionProvider (RTL) |

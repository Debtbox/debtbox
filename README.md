# Debtbox

Debt management platform for merchants and customers. Built with React, TypeScript, and Vite.

**Live:** [https://debtbox.sa](https://debtbox.sa)

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** – build tool
- **Tailwind CSS 4** – styling
- **React Router 7** – routing
- **TanStack Query** – data fetching
- **Zustand** – state management
- **i18next** – internationalization (EN, AR, BN, UR)
- **React Hook Form** + **Zod** – forms & validation

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Install & Run

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build for production
pnpm run build

# Preview production build locally
pnpm run preview
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (http://localhost:5173) |
| `pnpm run build` | Production build → `dist/` |
| `pnpm run preview` | Serve production build locally |
| `pnpm run lint` | Run ESLint |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API endpoint | `https://api.debtbox.sa/v0.0.1/api` |
| `VITE_ENV` | Environment (`development` / `production`) | - |

Set at **build time** (Vite embeds them in the bundle).

## Deployment

- **Docker:** See [docs/DOCKER.md](docs/DOCKER.md)
- **Production SSL & DevOps:** See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Project Structure

```
src/
├── components/     # Shared UI components
├── features/       # Feature modules (auth, dashboard, landing, etc.)
├── lib/            # Axios, query client
├── routes/        # Route definitions
├── stores/        # Zustand stores
├── utils/         # Helpers, storage
└── types/         # TypeScript types
```

## License

Private – Debtbox

# upcheck-web

> Know before your users do.

React frontend for [Upcheck](https://github.com/rockeykotwal/upcheck-api) — search any of 12 major services, see live status at a glance, drill into incident history, and generate an AI summary of recent outages. No account required.

---

## Features

- **Live status dashboard** — color-coded badges for all tracked services (operational · degraded · partial outage · major outage · under maintenance)
- **Instant search** — debounced search filters services as you type, no page reload
- **Incident timeline** — per-service snapshot history ordered newest first
- **AI incident summaries** — one click to generate a plain-English summary of recent incidents via the backend AI provider
- **Dark mode** — system preference detected automatically, toggle in header
- **Skeleton loading** — every loading state has a proper skeleton, no layout shift
- **Error boundary** — top-level catch with a "Try again" recovery path
- **Code-split routes** — lazy-loaded pages for fast initial load

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TypeScript 5 |
| Build | Vite 6 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Data fetching | TanStack React Query v5 |
| Routing | React Router v7 |
| HTTP | Axios |

---

## Running locally

The frontend is a plain Vite app — no Docker needed on this side. Docker is only required for the [backend infrastructure](https://github.com/rockeykotwal/upcheck-api).

**Prerequisite:** have `upcheck-api` running at `http://localhost:3000`.

```bash
git clone https://github.com/rockeykotwal/upcheck-web
cd upcheck-web
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
```

App runs at `http://localhost:5173`

---

## Production deployment

Build a static bundle and serve it from any CDN, static host, or reverse proxy.

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

**Recommended hosts:** Vercel · Netlify · Cloudflare Pages · any NGINX/Caddy serving `dist/`

Set `VITE_API_URL` to your production API domain at build time:

```bash
VITE_API_URL=https://api.upcheck.live npm run build
```

All routes are client-side — configure your host to serve `index.html` for all paths (SPA fallback).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Vitest |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |
| `VITE_APP_NAME` | Display name shown in the header | `Upcheck` |
| `VITE_ENV` | Environment label | `development` |

> All `VITE_` variables are inlined at build time by Vite — they are not secret. Never put API keys here.

---

## Related

- [upcheck-api](https://github.com/rockeykotwal/upcheck-api) — Express backend

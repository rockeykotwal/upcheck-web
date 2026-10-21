# upcheck-web

Frontend for [Upcheck](https://github.com/rockeykotwal/upcheck-api) — a live service status aggregator that shows whether popular services (GitHub, Stripe, Cloudflare, etc.) are up or down.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS · shadcn/ui · React Query · Zustand

---

## Local Development

The frontend is a plain Vite app — no Docker needed. Docker is only required for the backend infrastructure.

**Prerequisite:** Have [upcheck-api](https://github.com/rockeykotwal/upcheck-api) running on `http://localhost:3000`.

```bash
git clone https://github.com/rockeykotwal/upcheck-web
cd upcheck-web
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
```

App runs at `http://localhost:5173`

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |
| `VITE_APP_NAME` | App display name | `Upcheck` |
| `VITE_ENV` | Environment | `development` |

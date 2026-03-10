# KUCCPS Cluster System

Monorepo with:
- `frontend/`: React + Vite app.
- Root backend (`index.ts`, `clusterEngine.ts`): Express TypeScript API (Daraja, email, Firebase Realtime Database, and static frontend serving).

## Install

```bash
npm install
npm --prefix frontend install
```

## Build

```bash
npm run build
```

This builds:
- `frontend/dist` (frontend)
- `dist` (backend TypeScript output)

If your hosting plan cannot build (for example, a low-resource Truehost plan), run the build locally and deploy the generated `dist/` and `frontend/dist/` folders. You can set `SKIP_BUILD=true` on the host to skip automatic build steps if the platform runs `npm run build` by default.

## Run backend server

```bash
npm start
```

Backend endpoints (default `http://localhost:5001`):
- `POST /api/payments`
- `POST /api/payments/query`
- `POST /api/payments/callback`
- `GET /api/payments/validation`
- `GET /api/catalog`
- `POST /api/sessions`
- `GET /api/sessions/:code`
- `POST /api/admin/login`
- `GET /api/admin/me`
- `POST /api/admin/logout`
- `GET /api/admin/health`
- `POST /stkPush`
- `GET|POST /paymentStatus`
- `POST /calculateClusterPoints`
- `POST /sendEmail`
- `POST /callback`
- `POST /darajaCallback`
- `GET /health`

If `5001` is in use, the server retries subsequent ports (`5002`, `5003`, ...).

Optional overrides in root `.env`:
- `PORT=5001`
- `PORT_RETRIES=20`
- `MPESA_*` credentials and callback URL
- `FIREBASE_*` project configuration (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId`)
- `REALTIME_*` paths
- `SUPER_ADMIN_EMAIL`

Production notes:
- Set `CORS_ORIGIN` to a comma-separated list of allowed origins, for example
  `https://clusterpointscalculation.co.ke,https://cluster-calculation-production.up.railway.app`, if your frontend is
  served from those domains and you need cross-origin API calls.
- `VITE_API_BASE_URL` (frontend build-time, optional): set to your API origin (example `https://clusterpointscalculation.co.ke`) when the frontend and backend are hosted on different origins. Leave empty when the backend serves the frontend at the same origin.

## Access model

- Public users (calculator, payment flow, results/course checks) do not require authentication.
- Admin authentication is only required for `/admin` UI routes and `/api/admin/*` backend routes.
- Public course browsing uses bundled `courses.csv`; admin mode reads/writes the backend Firebase catalog.

## Project structure

```text
clusterEngine.ts
index.ts
frontend/
  public/
  src/
```

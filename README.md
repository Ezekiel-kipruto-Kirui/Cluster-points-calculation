# KUCCPS Cluster System

Monorepo with:
- `frontend/`: React + Vite app.
- `backend-server/`: Express TypeScript API (Daraja, email, Firebase Realtime Database, and static frontend serving).

## Quick start

```bash
npm run bootstrap
npm run dev
```

## Build frontend

```bash
npm run build
```

## Run backend server

```bash
npm run serve
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
Optional overrides in `backend-server/.env`:
- `PORT=5001`
- `PORT_RETRIES=20`
- `MPESA_*` credentials and callback URL
- `FIREBASE_*` project configuration (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, `measurementId`)
- `REALTIME_*` paths
- `SUPER_ADMIN_EMAIL`

Frontend no longer requires Firebase or Daraja environment variables; those are now centralized in `backend-server/.env`.

## Access model

- Public users (calculator, payment flow, results/course checks) do not require authentication.
- Admin authentication is only required for `/admin` UI routes and `/api/admin/*` backend routes.
- Public course browsing uses bundled `courses.csv`; admin mode reads/writes the backend Firebase catalog.

## Project structure

```text
backend-server/
frontend/
  public/
  src/
```

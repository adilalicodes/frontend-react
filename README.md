# myStorage frontend

React + Vite + Tailwind CSS. It currently talks to the backend's `GET /health` only; the backend has no file endpoints yet, so the file list shows an honest "not available" state.

## Local

```bash
cp .env.example .env     # VITE_API_BASE_URL=http://localhost:3000
npm install
npm run dev              # http://localhost:5173
```

Run the backend in another terminal (`cd ../backend && npm run dev`).

## Render Static Site

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_API_BASE_URL` = your backend URL, e.g. `https://mystorage-api.onrender.com` (no trailing slash). It is baked in at build time, so redeploy after changing it.
- Then set the backend's `FRONTEND_ORIGIN` to this static site's URL.

## Authentication

Auth state comes from `GET /api/auth/me`; requests use `credentials: 'include'` so the backend's HttpOnly session cookie is sent. Routes use `HashRouter` (`/#/login`, `/#/signup`), so no SPA rewrite rule is needed on Render. The backend must list this site's origin in `FRONTEND_ORIGIN`.
# frontend-react

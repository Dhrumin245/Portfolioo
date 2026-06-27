# Admin protection (Projects CMS)

## What is protected
All write/admin endpoints in `Backend/routes/projectRoutes.js` are protected by an API-key header.

Protected endpoints:
- `POST /api/projects`
- `PUT /api/projects/:slug`
- `DELETE /api/projects/:slug`
- `POST /api/projects/upload-image`
- `POST /api/projects/:slug/restore/:versionIndex`

## How to configure
Set this environment variable on your hosting platform:

- `ADMIN_API_KEY`: a long random secret string

Optional:
- `API_KEY`: if `ADMIN_API_KEY` is not set, `adminAuth.js` will fall back to `API_KEY`.

Example (Backend/.env):
```env
MONGO_URI=...
ADMIN_API_KEY=replace_with_long_random_secret
```

## How the frontend authenticates
The admin page sends header `x-admin-api-key`.

Set in your frontend environment (Vite):
- `VITE_ADMIN_API_KEY`

So that `import.meta.env.VITE_ADMIN_API_KEY` is available at build time.

## Request header
Clients must send:
- Header name: `x-admin-api-key`
- Value: your `ADMIN_API_KEY`

## Failure mode
If `ADMIN_API_KEY` is not configured on the server, admin endpoints return `500` with an error message and are effectively non-accessible.


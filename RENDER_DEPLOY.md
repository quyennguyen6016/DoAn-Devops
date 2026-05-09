# Render Deployment

## Files

- `render.yaml`: Render Blueprint for frontend, backend, and PostgreSQL
- `backend/Dockerfile`: backend image build
- `frontend/Dockerfile`: frontend image build
- `backend/docker-entrypoint.sh`: maps `DATABASE_URL` to the backend's existing PostgreSQL env vars

## What this hosting setup does

- `backend` is a public Render web service built from `backend/Dockerfile`
- `frontend` is a public Render web service built from `frontend/Dockerfile`
- `database` is a managed Render Postgres database
- `frontend` receives the backend's public Render URL through `VITE_API_URL`
- `backend` receives the frontend's public Render URL through `FRONTEND_URL`
- `backend` receives the Render Postgres connection string through `DATABASE_URL`

This setup fits Render's free plan behavior, where free web services can send private requests but cannot receive private traffic.

## Deploy on Render from GitHub

1. Push this repository to GitHub.
2. Open Render and connect your GitHub account.
3. Select `New` -> `Blueprint`.
4. Choose this repository and the branch that contains `render.yaml`.
5. Deploy the Blueprint. Render will create:
   - `order-system-frontend`
   - `order-system-backend`
   - `order-system-db`

## Hosted URLs

- Frontend: Render gives an `onrender.com` URL automatically.
- Backend: Render gives an `onrender.com` URL automatically.
- Database: managed Render Postgres, connected to the backend by `DATABASE_URL`.

## Custom domain

If you own a domain, attach it to the frontend service:

1. Open the frontend service in Render.
2. Go to `Settings` -> `Custom Domains`.
3. Add your domain or subdomain.
4. Update the DNS records at your domain provider.
5. Click `Verify` in Render after DNS propagation.

Render automatically provisions HTTPS/TLS for the custom domain.

## Import the `devops` SQL data

If you want the hosted PostgreSQL database to use the existing `devops` dump:

1. Open the Render Postgres service.
2. Copy the external connection string or the provided PSQL command.
3. Run the import from your terminal:

```powershell
psql "postgresql://USER:PASSWORD@HOST:PORT/devops" -f "E:\DoAn-Devops-main\docker\postgres\init\01-devops.sql"
```

## Notes

- `frontend` calls the backend's public Render URL.
- This keeps the existing React source unchanged and avoids private-network limits on free web services.
- Free Render Postgres is suitable for demo/testing only and expires after 30 days unless upgraded.

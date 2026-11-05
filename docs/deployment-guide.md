# Deployment guide

## Development

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `DATABASE_URL=postgresql://atelier:atelier_dev_password@localhost:5432/atelier`.
3. Start PostgreSQL with `docker compose up -d postgres`.
4. Run `cd backend && npm install && npm run prisma:generate`.
5. Create the development migration with `npm run prisma:migrate -- --name init`.
6. Start the API with `npm run dev`.
7. Start the frontend in a second terminal with `cd frontend && npm install && npm run dev`.

Never commit `.env` files. Production credentials must be supplied by the deployment environment.

## Docker Compose

From the repository root:

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f backend
```

The GitHub Actions deployment workflow expects `VPS_HOST`, `VPS_USERNAME`, `VPS_SSH_KEY`, and `VPS_APP_DIRECTORY` repository secrets. It pulls the tagged checkout on the VPS and rebuilds the Compose services.

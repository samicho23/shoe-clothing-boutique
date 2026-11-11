# Backend deployment

## Docker Compose

1. Copy `.env.example` to `.env`.
2. Set a production `JWT_SECRET` and a production `DATABASE_URL`.
3. Start the API:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

The API listens on the configured `PORT` (default `4000`). Uploaded files are stored in the `backend_uploads` Docker volume.

## Database migrations

Run migrations before starting a new release:

```bash
npm ci
npm run prisma:deploy
```

Do not commit `.env`, database credentials, JWT secrets, or Postmark tokens.

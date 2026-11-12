# boutique backend

Express + TypeScript API for the boutique frontend. The backend uses PostgreSQL through Prisma for authentication, products, inventory, dashboard metrics, and resource modules.

```bash
npm install
npm exec prisma generate
npm exec prisma migrate deploy
npm exec prisma db seed
npm run dev
```

Set `DATABASE_URL` in `.env` to your PostgreSQL connection string. For the included development Docker stack, use `postgresql://boutique:boutique_dev_password@localhost:5433/boutique_db`.

The initial schema migration is stored in `prisma/migrations/20261111223000_init`. The API is available at `http://localhost:4000/api/v1`.

Interactive Swagger documentation is available at `http://localhost:4000/api/docs`, and the OpenAPI document is available at `http://localhost:4000/api/docs.json`.

The backend API resource catalog for importing into API tooling is available at `.postman/resources.yaml`.

Demo login:

```text
email: admin@boutique.local
password: boutique-admin
```

Do not use the demo credentials in production. Set a random `JWT_SECRET` in `backend/.env`.

Optional integrations:

```text
POSTMARK_SERVER_TOKEN=...
POSTMARK_FROM_EMAIL=no-reply@example.com
POSTMARK_MESSAGE_STREAM=outbound
REDIS_URL=redis://localhost:6379
```

Postmark email sending is disabled until both Postmark variables are configured. Redis is also optional; call `connectRedis()` from `src/lib/redis.ts` when a feature needs a cache or queue connection.

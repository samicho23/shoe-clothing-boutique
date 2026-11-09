# Atelier backend

Express + TypeScript API for the Atelier frontend. The backend now follows a modular structure with shared configuration, middleware, authentication, RBAC, product routes, Prisma schema, seed support, tests, and Docker packaging. Product storage is still an in-memory development adapter until the persistence service is wired to Prisma.

```bash
npm install
npm run dev
```

The API is available at `http://localhost:4000/api/v1`. The in-memory store is intentionally a development foundation; the next backend phase can replace it with Prisma/PostgreSQL without changing the route prefix.

Interactive Swagger documentation is available at `http://localhost:4000/api/docs`, and the OpenAPI document is available at `http://localhost:4000/api/docs.json`.

Demo login:

```text
email: admin@atelier.local
password: atelier-admin
```

Do not use the demo credentials in production. Set a random `JWT_SECRET` in `backend/.env`.

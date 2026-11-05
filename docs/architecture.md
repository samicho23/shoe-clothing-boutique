# Architecture

Atelier is split into a Vite React client and an Express TypeScript API.

- `frontend/`: responsive dashboard and future REST query/mutation hooks.
- `backend/`: versioned API under `/api/v1`, validation, and persistence boundary.
- `backend/prisma/`: PostgreSQL schema and migrations.
- `docs/`: requirements, database, API, and deployment documentation.

The backend owns authorization and business rules. The frontend is a presentation client and must not be treated as a security boundary.

## Local services

- Frontend: `http://localhost:5173`
- API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`

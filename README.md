# Atelier — Boutique operations

Atelier is a responsive React/Vite dashboard with a separate Express/TypeScript API for managing a shoe and clothing boutique. The current slice establishes the visual system and the main operational surfaces: overview metrics, revenue reporting, inventory watch, product management, navigation between modules, notifications, and an add-product workflow.

## Run locally

Open two terminals:

```bash
cd backend
npm install
npm run dev
```

## Run the full stack with Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- PostgreSQL: `localhost:5432`

Set a strong `JWT_SECRET` in a production environment before deploying. The Compose value is only a development placeholder.

```bash
cd frontend
npm install
npm run dev
```

Create a production build with:

```bash
cd frontend
npm run build
npm run preview
```

## Current UI flows

- **Overview**: revenue metrics, six-month revenue chart, recent sales, inventory watch, and quick actions.
- **Products**: searchable product table and add-product modal.
- **Inventory, Purchases, Customers, Suppliers, Reports, Point of sale**: navigable module shells ready to be wired to the REST API.
- Responsive mobile navigation and layouts.
- Notification popover and form controls with focus states.

## Project structure

```text
frontend/
  Dockerfile
  .dockerignore
  src/
    App.tsx       # Application shell, dashboard, modules, and modal flows
    main.tsx      # React entry point
    styles.css    # Boutique design system and responsive layout
  package.json
backend/
  Dockerfile
  .dockerignore
  src/server.ts   # Express API, validation, and product routes
  package.json
.github/
  workflows/
    ci.yml
    deploy.yml
docs/
  requirements.md
  architecture.md
  database-design.md
  api-documentation.md
  deployment-guide.md
```

## Next integration phase

The UI is intentionally componentized around the API boundaries described in the original product brief. The next phase is to add Prisma/PostgreSQL, authentication, and the remaining `/api/v1` resources, then replace the dashboard's typed sample records with API hooks. No production data or secrets are included in this repository.

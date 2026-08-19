# Grad Radar

Community-driven graduate school application and admissions decision tracker.

## Features

- [Track Master's and Doctoral applications.](client/src/pages/ApplicationForm.tsx#L70)
- [Add schools, programs, terms, GPA, awards, publications, and comments.](client/src/pages/ApplicationForm.tsx#L41)
- [Track decisions as accepted, rejected, or waitlisted.](client/src/pages/ApplicationsPage.tsx#L188)
- [Add an ending term when an application is waitlisted.](api/src/schemas/decision.ts#L15)
- [Update a waitlisted decision later when the result changes.](client/src/components/DecisionForm.tsx#L134)
- [View, search, and filter recent community decisions.](client/src/pages/RecentDecisionsPage.tsx#L94)
- [View analytics by school, program, degree, term, GPA, research area, and decision.](client/src/pages/AnalyticsDashboard.tsx#L37)
- [Explore application flow, GPA acceptance rates, and decision rates by awards and publications.](client/src/pages/AnalyticsDashboard.tsx#L360)
- [Manage account information and application defaults.](client/src/pages/AccountPage.tsx#L38)
- [Use the site in light or dark mode.](client/src/components/HeaderActions.tsx#L33)

## Technologies

- React, TypeScript, and Ionic React
- Vite
- Express
- PostgreSQL
- Prisma
- TanStack React Query
- Recharts
- Zod
- JWT and bcryptjs for authentication
- Yarn workspaces

## Setup

You need Node.js `24.18.0`, Yarn `4.18.0`, and a local PostgreSQL database.

From the project root:

```bash
corepack enable
corepack yarn install
cp api/.env.example api/.env
cp client/.env.example client/.env
```

Open `api/.env` and set `DATABASE_URL` to your PostgreSQL connection string. The default client API URL in `client/.env` is `/api`, which uses the Vite proxy during local development.

Create the database tables and add sample data:

```bash
corepack yarn prisma:generate
corepack yarn db:migrate
corepack yarn db:seed
```

Start the API and client together:

```bash
corepack yarn dev:all
```

The API runs on `http://localhost:3000`. Vite prints the client URL in the terminal, usually `http://localhost:5173`.

## Other Commands

```bash
corepack yarn build          # Build the client
corepack yarn lint           # Run the client linter
corepack yarn typecheck:api # Check API TypeScript
corepack yarn db:studio     # Open Prisma Studio
```

## AI Disclosure

### Sukitoru

I used ChatGPT as a learning and development assistant. I used it to find relevant documentation and examples, explain how an implementation works. I then wrote and adapted the code for Grad Radar. GPT reviewed my work and provided feedback, creating a cycle of research, implementation, review, and revision. I made the final design decisions and was responsible for testing and understanding the submitted code.

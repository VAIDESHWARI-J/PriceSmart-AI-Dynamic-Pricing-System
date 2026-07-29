# PriceSmart AI — AI-Based Dynamic Pricing System

Hackathon project. Built phase-by-phase — see `/docs` for full architecture,
database design, API planning, UI structure, and diagrams (ER, use case, workflow,
system architecture).

## Tech Stack

**Frontend:** React + Vite, Tailwind CSS, React Router, Axios, Recharts, Framer Motion
**Backend:** Node.js, Express.js, MongoDB, JWT
**AI Service:** Python Flask, Pandas, Scikit-Learn, XGBoost, Joblib

## Build Status

- [x] Phase 1 — Architecture, DB Design, API Planning, Diagrams
- [x] Phase 2 — Frontend scaffold (Vite, Tailwind, Routing, Layout, Sidebar, Navbar, Dashboard UI)
- [ ] Phase 3 — Backend (Node/Express/MongoDB/JWT)
- [ ] Phase 4 — AI Service (Flask/XGBoost)
- [ ] Phase 5 — Integration, polish, deployment prep

## Documentation Index

| Doc | Contents |
|---|---|
| [`docs/01-architecture.md`](docs/01-architecture.md) | System architecture, deployment topology, cross-cutting concerns |
| [`docs/02-folder-structure.md`](docs/02-folder-structure.md) | Full target repo layout for every service |
| [`docs/03-database-design.md`](docs/03-database-design.md) | MongoDB collections, schemas, indexing plan |
| [`docs/04-api-planning.md`](docs/04-api-planning.md) | Every backend + AI service REST endpoint |
| [`docs/05-ui-structure.md`](docs/05-ui-structure.md) | Route map, page-by-page UI breakdown |
| [`docs/06-diagrams.md`](docs/06-diagrams.md) | ER diagram, use case diagram, workflow diagrams, system diagram (Mermaid) |

## Running the diagrams

All diagrams are Mermaid code blocks. View them with:
- VS Code extension "Markdown Preview Mermaid Support", or
- https://mermaid.live (paste the code block)

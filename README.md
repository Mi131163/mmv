# MMV Donor Management — Prototype

A presale prototype for a donor relationship management system used by Relationship Managers at MMV (Medicines for Malaria Venture). Built to demonstrate a polished, data-forward product experience.

## Live Demo

Deployed to GitHub Pages: `https://Mi131163.github.io/estimator/`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS 3 with CSS custom properties |
| Routing | React Router v7 |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |
| State | useState / props |
| Deploy | GitHub Actions → GitHub Pages |

## Features

- **Dashboard** — personalised "Good morning" view with to-dos, donor pipeline, revenue forecast chart, and next engagement
- **Donors List** — searchable, filterable table of all donor relationships
- **Donor 360** — 8-tab detail view: 360 summary, About, Contacts, Engagements, Opportunities, Grants, Documents, Activity
- **Coming soon placeholders** — Opportunities, Grants, Deliverables

All data is static and fictional, using realistic names, grant codes, and amounts.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in the terminal).

## Folder Structure

```
src/
├── components/
│   ├── charts/
│   │   └── RevenueChart.tsx     # Pure SVG grouped bar chart
│   ├── layout/
│   │   ├── AppShell.tsx         # Root layout wrapper (sidebar + header + outlet)
│   │   ├── Header.tsx           # Top bar with search + notifications
│   │   └── Sidebar.tsx          # Icon-only nav with tooltips
│   └── ui/
│       ├── Avatar.tsx           # Initials circle
│       ├── Badge.tsx            # Status / type pills
│       ├── Button.tsx           # Primary / ghost / destructive
│       └── Card.tsx             # Surface card wrapper
├── data/
│   └── mockData.ts              # All static fictional data
├── pages/
│   ├── ComingSoon.tsx           # Placeholder for unbuilt routes
│   ├── Dashboard.tsx            # / route
│   ├── DonorDetail.tsx          # /donors/:id route
│   └── DonorsList.tsx           # /donors route
├── types/
│   └── index.ts                 # Shared TypeScript interfaces
├── App.tsx                      # Route definitions
├── index.css                    # CSS variables + Tailwind directives
└── main.tsx                     # React entry point
```

## Build

```bash
npm run build    # TypeScript check + Vite production build → dist/
npm run preview  # Preview the production build locally
```

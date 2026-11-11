# NxtDealer Admin Portal

Desktop-first admin web app for monitoring the NxtDealer mobile app ecosystem.

## Stack

React 19 · TypeScript 7 · Vite 8 · Tailwind CSS 4 · shadcn/ui (Radix) · React Router 8 · TanStack Query 5 · TanStack Table 9 · Recharts 3 · Lucide

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the dev server                |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Lint with oxlint                    |

Copy `.env.example` to `.env.local` to override defaults.

## Architecture

```
src/
├── app/          App bootstrap: providers, router, query client, route metadata
├── config/       Static config: env, routes, navigation, app constants
├── styles/       tokens.css (design tokens) + globals.css (Tailwind theme bridge)
├── types/        Domain interfaces (Dealer, MarketplaceListing, AiReel, …)
├── mocks/        Mock fixtures — only imported by services/mock
├── services/
│   ├── contracts/  Service interfaces (the API contract the UI depends on)
│   ├── mock/       In-memory implementations of the contracts
│   ├── http/       Typed fetch client for future real implementations
│   ├── query-keys.ts
│   └── index.ts    Service registry — the single mock ↔ API swap point
├── features/     Domain logic per module (query hooks now; components later)
├── hooks/        Cross-cutting hooks
├── components/
│   ├── ui/       shadcn primitives (owned source, brand-tuned)
│   ├── layout/   App shell: sidebar, topbar, page header/container
│   └── common/   Shared composites
├── pages/        Route-level components (thin: compose features + layout)
└── lib/          Utilities (cn, formatters)
```

### Domain model

- **Garage vehicle** (`GarageVehicle`) is every vehicle a dealer added in the app — the single source of vehicle truth.
- **Marketplace** is the subset of garage vehicles whose `marketplace.status` is `published`. It is a view, never a
  separate inventory: marketplace counts are always a share of garage counts, never added to them.
- **AI reel** (`AiReel`) references a vehicle; one vehicle can have many reels, so reel counts are content counts.
- Dealer `stats` and dashboard totals are computed by the service from these records.
- The portal is read-only: no service exposes create, edit, publish or delete operations.

### Data flow

`page → feature hook (TanStack Query) → services registry → contract → mock | http`

Pages and components never import mocks or call `fetch`. To connect the backend, implement
the contracts in `services/http/`, return them from `services/index.ts`, and set
`VITE_DATA_SOURCE=http`.

### Conventions

- Files: `kebab-case.tsx`; components: `PascalCase`; hooks: `use-*.ts` exporting `useX`.
- Route paths only from `ROUTES`; nav labels/icons only from `NAV_ITEMS`.
- Colors only through semantic tokens (`bg-card`, `text-foreground-secondary`, `text-primary`) — no raw hex in components.
- Type scale: `text-display`, `text-page-title`, `text-section-title`, `text-sm` (body), `text-caption`, `text-overline`.

## Design system

Tokens live in `src/styles/tokens.css`; Tailwind utilities are mapped in `src/styles/globals.css`.
Pink (`primary`) is reserved for primary actions, the active nav item, focus and selected states.

| Need                     | Use                                                         |
| ------------------------ | ----------------------------------------------------------- |
| Page title + actions     | `PageHeader` (pass a line `TabsList` as children for views) |
| Block heading in a page  | `SectionHeader` inside `PageSection`                        |
| KPI tile                 | `StatCard` / `StatCardSkeleton`                             |
| Domain status            | `StatusBadge` + maps in `config/status.ts`                  |
| List of records          | `DataTable` + `createDataTableColumnHelper`, `Pagination`   |
| Search / filter          | `SearchInput`, `FilterDropdown` (single or multiple)        |
| View switching           | `Tabs` — `line` (page level) or `segment` (in a section)    |
| Nothing to show / failed | `EmptyState` (`empty`, `no-results`, `error`)               |
| Waiting                  | Skeletons first; `LoadingState` / `Spinner` otherwise       |
| List state in the URL    | `useUrlState` (see `pages/ui-kit/use-dealer-table-state.ts`) |

`cn` from `@/lib/utils` is configured with the custom type scale and shadows so they override component
defaults. shadcn's CLI generates `import { cn } from "cn"` — switch new components to `@/lib/utils`.

In development, **Developer → Component library** (`/ui-kit`) shows every component wired to the
mock services. The route is excluded from production builds.

## Mock media

`public/mock-media/` holds placeholder media for the mock data layer:

- **Vehicle photos** — 62 real photos of the catalogue models from Wikimedia Commons (CC licences; credits in
  `public/mock-media/vehicles/ATTRIBUTION.md`), centre-cropped to 1024×768. Grouped into colour sets in
  `src/mocks/vehicle-photos.ts`; a vehicle's colour always matches its photos.
- **AI reels** — 9:16 H.264 MP4s (+ poster) rendered from each multi-photo set.

Regenerating (`scripts/mock-media/`):

```bash
node scripts/mock-media/search-commons.mjs                 # find candidates → candidates.json
node scripts/mock-media/download-photos.mjs "$PWD"         # download picks.json selections, crop, write credits
swift scripts/mock-media/render-reels.swift "$PWD"         # render reels for sets in reel-sets.json (macOS)
```

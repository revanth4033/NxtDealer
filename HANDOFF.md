# NxtDealer Admin Portal: Project Handoff

This is the central context document for anyone, human or Claude Code session, continuing work on this repository.
Read it completely before changing anything. The repository is the source of truth: if this document and the code
disagree, trust the code and update this document.

> **This document gives context, not permission.** It does not authorise starting the next phase.
> Wait for the product owner's instructions before writing code.

---

## 0. Current status at a glance

| | |
|---|---|
| Last commit | `796b7e3`: `docs: update handoff with remote status and 12 Nov session log` (12 Nov 2026). Earlier: `dc56245` (handoff document), `843c9c3` (Phase 04B) |
| Remote | GitHub `origin/main` (`https://github.com/revanth4033/NxtDealer.git`) is at `796b7e3`, the same as local `main`. Claude Code commits and pushes only when the product owner explicitly instructs it (§9.1) |
| Working tree | **Phase 05 (Marketplace monitoring) is implemented but not committed**: 05A and 05B are approved; the final refinements are awaiting the product owner's review and commit approval. Also the untracked local `.claude/` folder (Claude Code configuration, not project code) |
| Completed phases | 01, 02, 03, 04A, 04B (approved and committed). 05A data layer and 05B UI approved, uncommitted |
| Next step | Product owner reviews the Phase 05 refinements, then gives explicit approval to commit and push. Phase 06 is not scoped |
| Checks | Typecheck, lint and production build pass on the current working tree (Phase 05 included) |
| Data source | Mock data only. No backend is connected. |

---

## 1. Project overview

| | |
|---|---|
| Product | **NxtDealer**: a dealer-first vehicle trading platform |
| Organisation / brand | nuLyft Technologies (provided by the product owner; the name does not appear anywhere in the repository) |
| This repository | **NxtDealer Admin Portal**: a React web app for monitoring the dealer ecosystem of the NxtDealer mobile app |
| Package name | `nxtdealer-admin-portal` |
| Target | Desktop-first (1440px primary design viewport), responsive down to about 390px |
| Data | Mock data served through a swappable service layer. Backend/API integration is planned for a later stage. |
| Locale | `en-IN`, currency INR, time zone `Asia/Kolkata` (`src/config/app.ts`) |

### Product concepts

- **Dealers** use the NxtDealer **mobile app** to manage their vehicle inventory (their *garage*).
- Dealers can **publish** garage vehicles to a **shared marketplace** that every NxtDealer dealer can browse.
  Marketplace vehicles are a **subset** of the garage, not extra vehicles.
- Dealers can create **AI promotional reels** (short videos) from a vehicle's photos. **One vehicle can have several reels.**
- **Admin users** use this portal to **monitor** dealers, their garages, marketplace listings and AI reels.

### Mobile app vs admin portal

| Capability | Mobile app (dealers) | Admin portal (this repo) |
|---|---|---|
| Join NxtDealer | Dealers are onboarded directly | Sees the account; no approval step exists |
| Manage garage vehicles | Add, edit, delete | **View only** |
| Publish to the marketplace | Publish, unpublish | **View only** |
| Create AI reels | Generate from vehicle photos | **View and play only** |
| Showroom | Add, edit, suspend, delete (one showroom today) | **View only** |
| Account status, plan | n/a | **View only**; cannot activate, suspend, delete or change plans |

The portal is **strictly read-only**. Allowed interactions: navigation, search, filtering, sorting, pagination and
read-only previews (vehicle sheet, reel player). Copying an ID to the clipboard is also allowed.

---

## 2. Confirmed product rules and business decisions

These are **confirmed requirements** from the product owner. Do not contradict them, and don't add behaviour around
them without explicit instruction.

### 2.1 Dealer accounts
- Dealers are **onboarded directly**. There is **no verification or approval workflow**.
- Dealer account status is **only `active` or `suspended`** (`DealerStatus` in `src/types/dealer.ts`).
- **Never introduce** Pending, In Review, Rejected, Unverified or Inactive statuses, or any verification field.
  These existed in early mock types and were removed in Phase 04A because they had no product basis.
- Low activity is **not** a status. If it's ever needed, derive it from data such as `lastActiveAt` and label it as such.
- Admins **cannot** edit, activate, suspend or delete dealers, change subscription plans, or manage dealer content.

### 2.2 Showrooms
- The current mobile app supports **exactly one showroom per dealer**. A dealer may have **no** showroom.
- Fields: showroom name, contact number, city, address (`Showroom` in `src/types/showroom.ts`).
- Showroom status is **`active` or `suspended`**, **independent** of the dealer's account status:
  an Active dealer can have a Suspended showroom, and a Suspended dealer can have an Active showroom.
- The portal **only displays** showroom information. No add, edit, suspend, delete or branch-management controls.
- **Future direction (not implemented):** multiple showrooms (branches) per dealer, and assigning vehicles to a
  showroom. **Do not implement multiple branches, branch selectors or vehicle-to-showroom assignment until
  explicitly instructed.**
- The data layer is ready for that future: `ShowroomService.listByDealer()` returns a list, and the UI picks the single
  showroom via `currentShowroom()` (`src/features/dealers/showrooms.ts`).

### 2.3 Vehicle inventory and marketplace
- The **garage** is every vehicle belonging to a dealer (`GarageVehicle`, the single source of vehicle truth).
- **Published** vehicles are a subset of the garage (`marketplace.status === 'published'`); **unpublished** vehicles stay in the garage.
- Garage total = published + unpublished. **Never count marketplace vehicles as extra vehicles.**
- Vehicles **do not have a `showroomId`**. Do not add one.
- Marketplace listings show **dealer attribution and city only**. No branch or showroom attribution until the mobile product supports it.
  (`VehicleCard`'s `showLocation` line is where a showroom name would go later.)

### 2.4 Marketplace monitoring (Phase 05)
- The Marketplace page shows **published vehicles only**. There is no listing entity: a listing is a `GarageVehicle`
  with `marketplace.status === 'published'`, and its listing ID is the vehicle ID.
- `marketplace.publishedAt` exists only on currently published vehicles. **There is no publication history**
  (no unpublish or republish records), so never show trends, period comparisons or "published per month" charts.
- KPIs and insights (top dealers, listings by city, listings by make) are **platform-wide** and unaffected by the
  directory filters. "City" is the dealer's city (`vehicle.city` is copied from `dealer.location.city`); no showroom attribution.
- Excluded on purpose: publication-date filtering (sorting by publication date is kept), moderation, flagging,
  publish/unpublish, buyer leads, enquiries, views and any transaction analytics.
- **Filter semantics** (`MarketplaceFilters`): values within one filter match any of them (OR); different filters must
  all match (AND). Year and price ranges are inclusive, either side may be blank, and min > max is invalid.
- **Model filter (approved by the product owner, 12 Nov 2026):** a selected model narrows only its own make.
  - With makes selected, a vehicle passes if its model is selected, or if none of the selected models belongs to its
    make. Example: Hyundai › Creta plus Kia shows Hyundai Creta and every Kia.
  - With no make selected, models filter strictly.
  - Deselecting a make also removes its selected models; choosing makes drops models that belong to none of them.
- **Filter counts are faceted:** each filter's option counts apply every other active filter (including search) but
  not that filter's own selection. Options with 0 are shown but disabled, unless already selected, so they can always
  be removed.

### 2.5 AI reels
- Reels are **separate content records** (`AiReel`) that reference a vehicle by `vehicleId`.
- A vehicle can have **multiple reels**. Always count **reel records**, not unique vehicles
  (`InventoryTotals.aiReels` counts records; `vehiclesWithReels` counts distinct vehicles).
- Preserve reel-to-vehicle relationships exactly (see §7).

---

## 3. Design system and visual direction

### 3.1 Brand tokens (from `src/styles/tokens.css`)

| Role | Value | Token |
|---|---|---|
| Primary | `#B51B75` | `--pink-500` → `--primary`, `--ring` |
| Primary dark | `#91165E` | `--pink-600` → `--primary-hover`, `--accent-foreground` |
| Accent | `#FAEFF5` | `--pink-50` → `--accent` |
| Background | `#F4F4F4` | `--neutral-100` → `--canvas`, `--muted` |
| Primary text | `#111212` | `--neutral-900` → `--foreground` |
| Secondary text | `#3C3C43` | `--neutral-700` → `--foreground-secondary` |
| Muted text | `#6B6B73` | `--neutral-500` → `--muted-foreground` |
| Border | `#E5E5E8` | `--neutral-200` → `--border` |
| Status | success `#17803D`, warning `#A35A00`, danger `#C42B2B`, info `#2458B8` (each with a `-soft` background) | |
| Radius | `--radius: 0.5rem`; cards use `rounded-xl` | |
| Elevation | `--elevation-card` / `-raised` / `-overlay`, deliberately subtle | `shadow-card`, `shadow-raised`, `shadow-overlay` |
| Layout | sidebar `15.5rem`, topbar `4rem`, content max width `90rem` | `w-sidebar`, `h-topbar`, `max-w-content` |

- **Typeface:** DM Sans (variable), loaded via `@fontsource-variable/dm-sans` in `src/styles/globals.css`.
- **Type scale** (in `globals.css`): `text-display` (30px), `text-page-title` (24px/600), `text-section-title` (16px/600),
  `text-sm` (body), `text-caption` (12px), `text-metric` (28px/600, KPI figures only).
- **`surface` utility** = `rounded-xl border bg-card shadow-card`: the standard white container for cards, tables and panels.
- **Two-layer tokens:** primitives in `tokens.css` (never used directly in components), semantic tokens mapped to
  Tailwind utilities in `globals.css`. Components use semantic utilities (`bg-card`, `text-foreground-secondary`,
  `text-primary`) and **never raw hex values**.
- Light theme only. A `dark` custom variant is declared but no dark theme exists.
- Chart colours (`--chart-1…5`) are marked *provisional*; no charts exist yet.

### 3.2 Design principles (product owner's direction)
- Clean, modern, professional SaaS admin interface with a restrained visual language.
- Clear information hierarchy, consistent spacing and typography.
- Subtle borders, shadows and surfaces. **Restrained use of pink**: primary actions, active nav, focus, selected
  states and "Published" marketplace badges.
- No excessive gradients, unnecessary decoration or playful illustrations.
- Prefer reusable components and consistent interaction patterns.
- No fabricated trends, sparklines or percentage changes. Every metric must come from real records.

### 3.3 Shared components (`src/components/`)

| Need | Use |
|---|---|
| Page title, description, actions, inline meta (e.g. a count) | `layout/PageHeader` |
| Page vertical rhythm, titled sections | `layout/PageContainer`, `PageSection` + `common/SectionHeader` |
| "Go to full page" link in a section header | `common/SectionLink` |
| KPI tile (optional part-of-whole meter) | `common/StatCard`, `StatCardSkeleton` |
| Domain status label | `common/StatusBadge` + maps in `src/config/status.ts` (`DEALER_STATUS`, `DEALER_PLAN`, `SHOWROOM_STATUS`, `MARKETPLACE_STATUS`) |
| Dealer / organisation initials | `common/EntityAvatar` (sizes `sm`, `md`, `lg`) |
| Record lists | `data-table/DataTable` + `createDataTableColumnHelper` (manual sorting, skeleton rows, toolbar/footer slots, optional whole-row click) |
| Paging | `common/Pagination` (hide it when there are no records) |
| Search / filters | `common/SearchInput` (debounced), `common/FilterDropdown` (single or multiple; optional option `group` headings, `disabled` options, a disabled trigger and `contentClassName`), `common/RangeFilter` (popover with labelled min/max inputs, inline validation, Apply/Clear) |
| Filter trigger look | `FilterTrigger` (exported from `common/filter-dropdown.tsx`), shared by FilterDropdown and RangeFilter so active filters look identical |
| Range parsing | `lib/range.ts`: `NumberRange`, `parseRangeBound` (blank = no limit; whole numbers ≥ 0; digit-group commas allowed), `getRangeError`, `isRangeSet` |
| Ranked bars | `features/marketplace/components/RankedBarList`: CSS horizontal bars; count and share are always text, the bar is decorative (`aria-hidden`). Neutral bar colour, not pink |
| Vehicle cards | `features/garage/VehicleCard`: optional `publishedDate="date"` (calendar date instead of "3 days ago"), `dealerHref` + `dealerLinkState` (dealer name as a link) |
| Mobile touch targets | Marketplace toolbar uses `max-sm:h-11` (44px) on controls and `max-sm:[&_[role^=menuitem]]:min-h-11` on menus; desktop keeps the standard 36px. `RangeFilter` popover controls are 44px below `sm` |
| View switching | `ui/Tabs`: `line` variant (page level) or `segment` (inside a section) |
| Empty / no-results / error | `common/EmptyState` (`empty`, `no-results`, `error`) |
| Loading | Skeletons first; `common/LoadingState` / `Spinner` otherwise |
| Placeholder for unbuilt modules | `common/ModulePlaceholder` |
| List state in the URL | `hooks/useUrlState` |
| Page-specific breadcrumb label / parent link | `hooks/usePageMeta` |

shadcn/ui primitives live in `src/components/ui/` (style `radix-nova`, unified `radix-ui` package). They're owned source
and tuned to the brand. **`cn` must be imported from `@/lib/utils`**, which is configured so the custom type scale and
shadows merge correctly. The shadcn CLI generates `import { cn } from "cn"`, so switch new components over.
`button.tsx` and `input.tsx` are customised, so don't overwrite them with `shadcn add`.

---

## 4. Technology stack (verified from `package.json` / `npm ls`)

| Area | Package | Installed |
|---|---|---|
| UI library | `react`, `react-dom` | 19.3.1 |
| Language | `typescript` | 7.0.2 (`tsc -b`) |
| Build / dev server | `vite` (Rolldown code-splitting groups in `vite.config.ts`), `@vitejs/plugin-react` | 8.3.8, 6.3.0 |
| Styling | `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css` | 4.3.5, 4.3.5, 1.4.0 |
| Components | `shadcn` (CLI + Tailwind preset), `radix-ui`, `class-variance-authority`, `cmdk` | 4.23.0, 1.8.1, 0.7.1, 1.1.1 |
| Class merging | `cn` (via `cn/config` `createCn`) | 0.5.2 |
| Routing | `react-router` (data router, `createBrowserRouter`, lazy routes) | 8.5.1 |
| Server state | `@tanstack/react-query` (+ devtools in development only) | 5.107.1 |
| Tables | `@tanstack/react-table` (`useTable`, `rowSortingFeature`) | 9.3.1 |
| Charts | `recharts`: **installed but not used anywhere yet** | 3.10.1 |
| Icons | `lucide-react` | 1.71.0 |
| Font | `@fontsource-variable/dm-sans` | 5.3.0 |
| Lint | `oxlint` (`.oxlintrc.json`: react, typescript, oxc plugins) | 1.93.0 |
| Runtime used in development | Node 22.23.1, npm 10.9.8 | |

There is no state-management library beyond TanStack Query and URL/search-param state. No test framework is set up.

### Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` (on this machine port 5173 is taken by another process, so use `npm run dev -- --port 5180 --strictPort`) |
| Typecheck | `npx tsc -b --noEmit` (there is no `typecheck` npm script) |
| Lint | `npm run lint` |
| Production build | `npm run build` (runs `tsc -b && vite build`) |
| Environment | Copy `.env.example` to `.env.local`: `VITE_DATA_SOURCE=mock`, `VITE_API_BASE_URL=`, `VITE_MOCK_LATENCY_MS=350` |

---

## 5. Architecture

### 5.1 Data flow

```
Page → feature hook (TanStack Query) → service registry (src/services/index.ts)
     → service contract (src/services/contracts) → mock implementation (src/services/mock)  [today]
                                                 → HTTP implementation (src/services/http)   [future]
```

- `src/services/index.ts` is the **single swap point**. `VITE_DATA_SOURCE=http` currently logs a warning and falls back to
  mock, because no HTTP services exist yet. `services/http/http-client.ts` has a typed `request()` helper ready for them.
- Contracts (`AppServices`): `dealers`, `showrooms`, `garage`, `marketplace`, `aiReels`, `analytics`, `session`.
  **Every contract is read-only.** No create, update, publish or delete methods.
- Mock services simulate latency, return deep copies (`structuredClone`) and do search, sort and paging in memory
  through `queryCollection()` (`services/mock/mock-utils.ts`). Errors are always `ApiError` (`services/errors.ts`);
  404s are not retried by the query client.
- Dealer `stats` and all dashboard totals are **computed from records** (`services/mock/mock-inventory.ts`,
  `mock-analytics-service.ts`), never stored.
- The marketplace service is a **view over garage vehicles** (published ones), not a separate dataset.
- Query keys are centralised in `src/services/query-keys.ts`.
- Services reject invalid input with `ApiError.badRequest()` (400), which the query client does not retry.

### 5.1a Marketplace data layer (Phase 05A)
- `MarketplaceListParams` = `ListParams<'publishedAt' | 'price' | 'year'>` + `MarketplaceFilters`
  (`src/types/vehicle.ts`): `dealerId` (single-dealer scope for the Dashboard and dealer page, not a directory filter),
  `search`, `dealerIds`, `cities`, `makes`, `models`, `fuelTypes`, `transmissions`, `yearMin/Max`, `priceMin/Max` (rupees).
- `MarketplaceService` (`services/contracts/marketplace-service.ts`), all read-only:
  - `list(params)`: filters (including search) first, then sorts (default `publishedAt desc`) and pages. Inverted or
    non-numeric ranges → 400.
  - `getInsights()`: totals (published listings, dealers with listings, cities, makes) and complete rankings by dealer,
    city and make, highest count first with ties ordered by label. Types in `src/types/marketplace.ts`.
  - `getFacets(filters)`: total matching, plus faceted counts for dealers, cities, makes, models (with their make),
    fuel types and transmissions, and year/price bounds for input hints (`null` when nothing is in scope).
    Every option in scope is returned, including zero counts.
- Mock implementation: `services/mock/mock-marketplace-service.ts` (`matchesFilters`, `matchesModels` for the model
  rule in §2.4). Model names are unique across makes in the catalogue, so a model identifies its make.
  `mock-utils.ts` gained `matchesSearch()`, which `queryCollection()` also uses.
- Query keys: `queryKeys.marketplace.insights`, `queryKeys.marketplace.facets(filters)`.
- Hooks (`features/marketplace/hooks/`): `useMarketplaceVehicles` (existing), `useMarketplaceInsights` and
  `useMarketplaceFacets` (`use-marketplace-insights.ts`), `useMarketplaceState` (URL state), `useDealerReturnState`.
- **URL state** (`useMarketplaceState`): `?q=`, repeatable `dealer=`, `city=`, `make=`, `model=`, `fuel=`,
  `transmission=`, then `yearFrom=`, `yearTo=`, `priceMin=`, `priceMax=`, `sort=field:dir`, `page=`, `size=` (12/24/48,
  default 12) and `view=grid` (default table). Any change to search, filters, ranges, sort or page size resets to page 1.
  Switching views keeps everything. Unknown values and bad or inverted ranges in a hand-edited URL are ignored, and an
  out-of-range page snaps to the last page.

### 5.1b Dealer page return navigation (Phase 05)
- Links into `/dealers/:dealerId` may carry router state `DealerLinkState` (`features/dealers/dealer-link-state.ts`):
  `directorySearch` (set by the Dealers directory) or `returnTo: { path, label }` (set by the Marketplace through
  `useDealerReturnState`, the exact filtered Marketplace URL).
- The dealer page's visible back link follows `returnTo` ("Marketplace"), otherwise the directory ("All dealers", with
  its filters restored). A direct visit falls back to `/dealers`. The breadcrumb always leads to Dealers.
  `readDealerLinkState()` validates the state, because it comes from history.

### 5.2 Principles to keep
- Pages and components **never import mock data** or call `fetch`. Data goes through feature hooks and services.
- Types (`src/types`) and contracts (`services/contracts`) stay separate from implementations.
- Reuse shared components; keep components focused and avoid oversized files.
- Avoid unnecessary dependencies, and don't change the architecture without a clear reason.
- Future API integration should only need new `services/http/*` implementations, not UI rewrites.
- Route paths only from `ROUTES` (`src/config/routes.ts`); nav labels and icons only from `NAV_ITEMS` (`src/config/navigation.ts`).
- Files are `kebab-case.tsx`; components `PascalCase`; hooks `use-*.ts` exporting `useX`.

### 5.3 Source structure (actual)

```
src/
├── app/            app.tsx, providers.tsx (QueryClient, Tooltip, dev-only devtools), query-client.ts,
│                   router.tsx (routes), route-handle.ts (route title/breadcrumb metadata)
├── config/         app.ts, env.ts, routes.ts (+ dealerDetailsPath), navigation.ts, status.ts (status → label/tone)
├── styles/         tokens.css (design tokens), globals.css (Tailwind theme bridge, type scale, `surface`)
├── types/          common, dealer, showroom, vehicle, ai-reel, analytics, admin-user
├── mocks/          dealers, showrooms, vehicles (garage + reels generator), vehicle-photos, vehicle-photo-alternates,
│                   admin-user. Imported ONLY by services/mock.
├── services/
│   ├── contracts/  ai-reel, analytics, dealer, garage, marketplace, session, showroom (+ AppServices in index.ts)
│   ├── mock/       one mock-*-service per contract, mock-inventory (computed stats), mock-utils
│   ├── http/       http-client.ts (typed fetch wrapper; no services yet)
│   ├── errors.ts, query-keys.ts, index.ts (registry)
├── features/
│   ├── dashboard/  dashboard-kpis, marketplace-overview, inventory-overview, dealer-inventory-table,
│   │               reels-overview; hooks/use-dashboard-summary
│   ├── dealers/    directory (columns, table, summary cards, URL state hook), detail (profile header,
│   │               activity KPIs, information, showroom), dealer-select, dealer-profile-card,
│   │               hooks (use-dealers, use-showrooms, use-dealer-directory-state), showrooms.ts,
│   │               dealer-link-state.ts (back-link router state)
│   ├── garage/     dealer-garage-table, vehicle-card, vehicle-detail-sheet, vehicle-image, vehicle-labels,
│   │               hooks/use-garage-vehicles
│   ├── marketplace/ components: marketplace-kpis, marketplace-insights, ranked-bar-list, recent-listings,
│   │               marketplace-directory (table/grid), marketplace-toolbar (search, sort, view, filters),
│   │               marketplace-columns, dealer-marketplace-listings;
│   │               hooks: use-marketplace-vehicles, use-marketplace-insights (+ facets),
│   │               use-marketplace-state (URL state), use-dealer-return-state
│   └── ai-reels/   reel-card, reel-preview-dialog, dealer-reel-gallery, reel-sequence, hooks/use-ai-reels
├── hooks/          use-url-state, use-page-meta, use-breadcrumbs, use-route-meta, use-document-title,
│                   use-current-admin, use-copy-to-clipboard
├── components/     ui/ (shadcn primitives), layout/ (app shell, sidebar, topbar, mobile nav, breadcrumbs,
│                   page header/container, user menu), common/ (shared composites), data-table/
├── pages/          dashboard, dealers, dealer-details, marketplace, ai-reels, settings, not-found,
│                   route-error, app-loader, ui-kit/ (dev-only component library)
└── lib/            utils.ts (cn), format.ts (numbers, ₹ L/Cr prices, km, dates, relative time, shares),
                    range.ts (range-input parsing and validation)
```

Other top-level items: `scripts/mock-media/` (photo and reel pipeline), `public/mock-media/` (photos, reels),
`README.md`, `.env.example`, `components.json` (shadcn), `.oxlintrc.json`, `vite.config.ts`.

### 5.4 App shell
- Fixed left **sidebar** on desktop (Dashboard; *Ecosystem*: Dealers, Marketplace, AI Reels; Settings pinned at the bottom;
  admin user menu). On small screens, a **Sheet drawer** opened from the topbar.
- Sticky **topbar**: mobile menu button, route-driven **breadcrumbs** (subtle; the H1 dominates), a "Mock data" source
  indicator and the user menu. "Sign out" is a **disabled** item: there is no authentication yet.
- The admin user comes from `SessionService.getCurrentAdmin()` (mock: "Admin User", `super_admin`).
- Accessibility features already in place: skip link, focus moves to `<main>` on navigation, document titles per route,
  `ScrollRestoration`, visible focus rings.

---

## 6. Routes and feature status

| Route | Status | What exists |
|---|---|---|
| `/` | Redirect | To `/dashboard` |
| `/dashboard` | **Implemented** (Phase 03) | *All dealers* view: KPIs (dealers, garage, marketplace, reels), latest marketplace vehicles, dealer inventory table, latest-reels strip. *Individual dealer* view via a searchable dealer selector (resets when leaving the page): dealer KPIs + profile card, the dealer's marketplace vehicles, garage table, reel gallery. Vehicle detail sheet and reel player. |
| `/dealers` | **Implemented** (Phase 04A) | Directory: header count, 4 summary cards (Total, Active, Suspended, Dealers with listings), search (name, owner, city), Account status and Plan filters, clear filters, sortable columns, pagination, URL-backed state, empty/no-results/error states, row click opens the dealer. |
| `/dealers/:dealerId` | **Implemented** (Phase 04B, back link extended in Phase 05) | Dealer detail: profile header, 4 activity KPIs, dealer information, single showroom card, garage inventory (tabs, search, pagination), marketplace listings, AI reels gallery, vehicle and reel previews, breadcrumb with the dealer's name, "Dealer not found" state. The back link returns to the originating page: the Dealers directory with its state restored, or the filtered Marketplace view (§5.1b). |
| `/marketplace` | **Implemented** (Phase 05, uncommitted) | Header with published count; 4 KPI cards (Published listings 160 with "45% of garage vehicles", Dealers with listings 16 "of 26 registered dealers", Cities 14, Vehicle makes 9 "Most listed: Maruti Suzuki (54)"); insights (top 5 dealers + "View all 16" dialog, listings by make, listings by city; CSS ranked bars); Recently published (latest 6 with calendar dates); All listings directory with search, 8 faceted filters (Dealer, City, Make, Model, Fuel, Transmission, Year from/to, Price min/max), sort menu and sortable headers, Table/Grid switch (9-column table, 3-column card grid), pagination, empty/no-results/error states, vehicle preview and reel player, dealer links. |
| `/ai-reels` | **Placeholder** | `ModulePlaceholder` with a reel count. Not designed or built. |
| `/settings` | **Placeholder** | `ModulePlaceholder`. Not designed or built. |
| `/ui-kit` | **Development only** | Component library (Data display, Inputs and navigation, Status and feedback). Registered only when `import.meta.env.DEV`, excluded from production builds, and **not in the sidebar**. |
| `*` | Implemented | Not-found page; route errors use `RouteErrorPage`. |

> The remaining placeholder pages (AI Reels, Settings) list "planned capabilities" written in Phase 01 (for example
> "Generation queue status", "Failure diagnostics", "Team & roles"). **These are not approved requirements**, and some
> conflict with the read-only rule. Confirm the real scope with the product owner before building these modules.
> (The Marketplace placeholder's "Moderation queue" and "Views and lead tracking" were dropped in Phase 05 as out of scope.)

---

## 7. Mock data and media

### 7.1 Final dataset (must be preserved)

| Entity | Count |
|---|---:|
| Dealers | 26 |
| Active dealers | 23 |
| Suspended dealers | 3 (Coastal Cars `dlr_1005`, Northern Drive `dlr_1108`, Valley View Cars `dlr_1116`) |
| Garage vehicles | 353 |
| Published vehicles | 160 |
| Unpublished vehicles | 193 |
| AI reels | 85 |
| Vehicles covered by reels | 53 (27 of them have more than one reel) |
| Showrooms | 22: one each for 22 dealers; 4 dealers have none (`dlr_1003`, `dlr_1104`, `dlr_1110`, `dlr_1114`) |
| Suspended showrooms | 3 (`dlr_1001`, `dlr_1005`, `dlr_1108`) |
| Dealers with at least one published vehicle | 16 |

### 7.2 Files
- `src/mocks/dealers.ts`: 8 hand-written dealer profiles plus 18 generated ones (deterministic). Every 8th generated dealer is suspended.
- `src/mocks/vehicles.ts`: **deterministic generator** (seeded PRNG, anchor date `Date.UTC(2026, 10, 10, 12, 0)`) for
  garage vehicles and AI reels. `EXPLICIT_PLANS` fixes scenario dealers; `GARAGE_ONLY` names dealers who have nothing
  published. A **display-only** `assignDistinctCovers()` pass runs after all business data is decided and changes only `photos`.
- `src/mocks/showrooms.ts`: at most one showroom per dealer (the type enforces it).
- `src/mocks/vehicle-photos.ts`: base colour sets per model (a vehicle's colour always matches its photos;
  sets with 2+ photos have a reel video).
- `src/mocks/vehicle-photo-alternates.ts`: **generated** alternate sets (same model and colour), used only by the cover pass.
- `src/mocks/admin-user.ts`: the mock admin.

### 7.3 Rules for mock data
- **The totals and relationships above are fixed.** Business data (which vehicles exist, are published or have reels, and
  every reel record) is identical to Phase 04A. Never let photo or media work change counts or relationships.
  (In Phase 04B a photo change once moved reels from 85 to 93; it was rejected and reverted.)
- Keep photo improvements **separate from business-data generation**. Change only `photos`, after generation.
- Never give a vehicle photos of a different model or colour just to avoid a repeat.
- Reel vehicles must keep their own photo set so the reel video matches the vehicle.
- **Verification fingerprints** (SHA-256 of `JSON.stringify(...)`, first 8 bytes in hex, computed in the browser through the dev
  server with `await import('/src/mocks/vehicles.ts')`):
  - `mockAiReels` → `54bfedbb34a61495`
  - `mockVehicles` with the `photos` field removed from each vehicle → `be9082c113569963`

### 7.4 Useful test dealers

| Dealer | Scenario |
|---|---|
| `dlr_1001` Sai Krishna Motors | Active dealer, **Suspended showroom** (LB Nagar), 34 garage / 18 published, 15 reels on 7 vehicles (several reels per vehicle) |
| `dlr_1004` Capital Car Bazaar | Largest garage: 46 / 22 published, 16 reels on 9 vehicles |
| `dlr_1002` Metro Wheels | Publishes vehicles, no reels |
| `dlr_1003` Shree Ganesh Auto | Recently joined, garage only, no reels, no showroom |
| `dlr_1005` Coastal Cars | Suspended dealer with a suspended showroom, nothing published, old reels remain |
| `dlr_1116` Valley View Cars | Suspended dealer with an **Active** showroom |
| `dlr_1110` Blue Ridge Cars | Empty garage, no showroom (empty states, no pagination) |

### 7.5 Media and attribution
- `public/mock-media/vehicles/`: 72 photos (62 base + 10 alternates) from **Wikimedia Commons** under CC/PD licences,
  centre-cropped to 1024×768. **Credits for every file are in `public/mock-media/vehicles/ATTRIBUTION.md`**
  (base table plus an "Alternate photos" section).
- `public/mock-media/reels/`: 14 reels (9:16 H.264 MP4, 360×640, 6 s) plus JPG posters, rendered from multi-photo sets;
  `ATTRIBUTION.md` there points back to the photo credits (the reels are adaptations).
- Total mock media is about 10 MB.
- Pipeline (`scripts/mock-media/`, documented in `README.md`):
  - `search-commons.mjs`: Commons metadata search → `candidates.json`
  - `download-photos.mjs <root>`: downloads `picks.json` selections, crops, writes `ATTRIBUTION.md`
  - `download-alternate-photos.mjs <root>`: downloads `alternate-picks.json`, writes `vehicle-photo-alternates.ts` and the "Alternate photos" credits section. Run it **after** `download-photos.mjs`.
  - `render-reels.swift <root>`: renders reels for `reel-sets.json` (macOS AVFoundation)
- **Remaining unavoidable repeated cover photos** (no suitable same-model, same-colour photos found):
  - Skoda Slavia, Carbon Steel (1 photo): `dlr_1001`, `dlr_1002`, `dlr_1107`
  - Tata Altroz, Avenue White (2 photos): `dlr_1004`, `dlr_1117` (twice)
  - Kia Seltos, Intelligency Blue (1 photo): `dlr_1004`
  - Sai Krishna's 2016 and 2023 Tata Altroz reels share the same video, because only one Altroz reel video exists and
    changing it would alter reel relationships.
- Some photos show non-Indian-market cars (foreign number plates), and some model generations don't match the listed year.
  This is accepted for mock data.
- **Marketplace photo reuse (Phase 05, unresolved):** the 160 published vehicles use only 63 distinct cover photos, so
  the platform-wide directory shows vehicles from different dealers with the same photo. Recently published (6) has no
  repeats; with the default sort and 12 per page, 8 of 14 directory pages show 1–3 repeated covers. Fixing it needs
  more same-model, same-colour Commons photos (downloads need the product owner's approval); mock data was not changed.

---

## 8. Development phase history

Phases 01–04B were completed on 11 November 2026; Phase 05 on 12 November 2026.

### Phase 01: Project foundation (`0a52108`)
Vite + React + TypeScript project, Tailwind 4 and shadcn setup, two-layer design tokens, folder architecture, routes
(`/dashboard`, `/dealers`, `/marketplace`, `/ai-reels`, `/settings`), domain types, service contracts with mock
implementations and the service registry (mock ↔ HTTP swap point), typed HTTP client, initial app shell and placeholder pages.

### Phase 02: Design system and application shell (`5b69f59`)
Sidebar, sticky topbar, route-driven breadcrumbs, responsive mobile navigation drawer, user menu, page header and
section components, shared composites (StatCard, StatusBadge, DataTable, Pagination, SearchInput, FilterDropdown,
EmptyState, loading states), the `/ui-kit` development route, URL-based table state (`useUrlState`), and accessibility and
responsive improvements (skip link, focus management, document titles).

### Phase 03: Dashboard (`7b7e6ca`)
*All dealers* and *individual dealer* dashboards with a searchable dealer selector. Domain remodel: GarageVehicle as
the single source of truth, the marketplace as the published subset, AI reels referencing vehicles, and dealer stats computed from records.
KPIs, marketplace preview, inventory overview (dealer table or dealer garage), AI reel gallery, read-only vehicle
detail sheet and reel player. Real Wikimedia Commons photos with attribution, and rendered reel videos.
Fabricated analytics (sparklines, trend indicators, percentage changes) removed. Refinements: realistic photos, reel
thumbnails, Developer nav removed from the sidebar (`/ui-kit` kept as a dev-only route), subtler breadcrumb.

### Phase 04A: Dealers directory (`71863ff`)
Directory page with summary cards, search, filters, sorting, pagination and URL-preserved state; the `/dealers/:dealerId`
route foundation with a not-found state; showroom type, mock records and read-only service.
**Account status correction:** the invented verification workflow and the Pending/Inactive statuses were removed;
dealer status became `active | suspended` only. The fourth card became "Dealers with listings".

### Phase 04B: Dealer detail page (`843c9c3`)
Full `/dealers/:dealerId` page: profile header, activity KPIs (garage, marketplace, unpublished, AI reels), dealer
information, single showroom card, garage inventory with All / Published / Not published tabs, search and pagination,
marketplace listing cards (dealer and city attribution), AI reels gallery, vehicle and reel previews, breadcrumb with the
dealer name, back navigation that preserves directory filters, sort and page, and an invalid-dealer state.
Garage table and dealer reel gallery moved into shared features (reused by the Dashboard). `usePageMeta` added for
runtime breadcrumb labels.
Final refinements: original 85 AI reel records restored (353 / 160 preserved); showroom data corrected to one per dealer
with independent status scenarios; 10 additional same-model, same-colour photos plus a display-only cover pass (repeats
within dealers went from 27 to 7); a mislabelled XL6 photo (actually a Suzuki XL7) replaced; empty-garage pagination
hidden; AI reels description updated.
Typecheck, lint and build passed; visual review approved; committed.

### Phase 05: Marketplace monitoring (12 Nov 2026, approved, not yet committed)
Worked in controlled steps after a technical discovery report.

**05A, data layer (approved):** `MarketplaceListParams` extended with `MarketplaceFilters`; `MarketplaceService`
gained `getInsights()` and `getFacets(filters)`; mock filtering applied before sort and pagination; faceted counts;
`ApiError.badRequest()` for invalid ranges; query keys; `useMarketplaceInsights`, `useMarketplaceFacets` and
`useMarketplaceState` (URL state). Validated by an independent script against the raw records (§10).

**05B, UI (approved):** the Marketplace page described in §6, built from existing components:
- StatCard, DataTable, Pagination, SearchInput, FilterDropdown, EmptyState, VehicleCard, VehicleDetailSheet,
  ReelPreviewDialog
- new RankedBarList, RangeFilter and FilterTrigger

Decisions made during review:
- The model filter narrows only its own make (§2.4). The original strict AND rule disabled every other make once a
  model was selected.
- Ranked bars use a neutral grey; pink stays for actions, selection and Published badges.
- The table's Vehicle cell shows the model over the make, so nine columns fit at 1440px.
- The directory grid uses 3 columns so dealer names aren't cut off next to full dates.
- The Marketplace nav description no longer mentions moderation or buyer engagement.

**Refinements (awaiting final review):**
- 44px mobile touch targets on toolbar controls, menu items and range-popover controls (desktop unchanged at 36px).
- The dealer page's back link returns to the originating Marketplace view (§5.1b); Dealers directory behaviour unchanged.

---

## 9. Development workflow and working preferences

### 9.1 Process for each phase
1. Read `HANDOFF.md` completely before making changes.
2. Inspect the repository and `git status` / `git log`.
3. Understand the requested phase and its exact scope.
4. Ask questions when an important product requirement is unclear. **Do not assume product behaviour.** If a field or
   status is not confirmed, report it as missing or assumed rather than inventing it.
5. Plan before making major changes.
6. Work in clearly defined phases; reuse existing components and architecture.
7. Do not start another phase without approval.
8. After implementing: typecheck, lint, production build.
9. Validate in the browser (1440px desktop, about 390px mobile) and verify numbers against raw mock records.
10. Give a clear completion report: what changed, checks run, assumptions, and missing or unverified data.
11. Share screenshots for visual review.
12. **Wait for approval before committing**, unless explicitly told to commit. Claude Code commits and pushes to
    GitHub only when the product owner explicitly instructs it.
13. Update this `HANDOFF.md` at the end of each completed phase or significant session (add a dated log entry).

### 9.2 Working style
The product owner provides requirements and design direction → Claude Code implements the agreed scope → shares results
and screenshots → the product owner reviews → refinements → approval → commit → next phase only after closing the
current one. Phase briefs typically end with "stop and wait for my review"; respect that.

### 9.3 Practical notes from previous sessions
- **Design skills:** for UI design work, load the `frontend-design` and `ui-ux-pro-max` skills first (the product owner's request).
  Brand tokens are fixed; use the skills for UX guidance, not new palettes or fonts.
- **Screenshots:** copy them out of the browser tool's temp folder (`/var/folders/…`, hidden in Finder) into
  `~/Downloads/Revanth/NxtDealer-screenshots/<phase-name>/` with numbered descriptive names. That folder is outside the repo.
- **Browser testing:** the Chrome window used for automation is maximised at about 1736px and resizing is unreliable. To test
  exact widths, render the app in a same-origin `<iframe>` at 1440px or 390px and drive it through the DOM.
- Downloading external assets (e.g. Commons photos) needs the product owner's approval. Use the generic
  user agent `NxtDealerMockMedia/1.0 (local development script)` and never personal details.
- Commit messages end with a `Co-Authored-By` trailer for Claude.

---

## 10. Known gaps, unverified items and documentation drift

- **Not implemented:** authentication (Sign out is disabled), real API services (`services/http` has only the client),
  AI Reels / Settings modules (placeholders), charts (Recharts installed but unused; Marketplace bars are CSS),
  automated tests, dark theme.
- **Marketplace (Phase 05) known limitations:**
  - Cover-photo reuse across dealers (§7.5).
  - On phones the 9-column table scrolls sideways inside its card, as on Dealers; the grid view suits phones better.
  - Pagination buttons stay 32px.
  - Sort has no secondary key for ties, so a real backend needs one (the mock keeps a stable order).
  - A real API must confirm whether a listing's city is stored per vehicle or per dealer.
- **Phase 05 verification script is not in the repository:** it lived in a Claude Code session scratchpad.
  It compared `list` / `getInsights` / `getFacets` with brute-force counts over `mockVehicles` (incl. 300 randomised
  filter combinations, the model rule and URL parsing). Recreate it if regression checks are needed; there is no
  test framework.
- **Unverified against the real product** (mock assumptions from Phase 01; confirm before relying on them):
  subscription plan values `free | growth | pro`; admin roles `super_admin | operations | support | viewer`;
  dealer fields `email`, `phone`, `lastActiveAt`; vehicle spec fields; reel duration (6 s mock videos); the "planned
  capabilities" text on placeholder pages.
- **Not available in the model:** dealer business address (only the showroom has an address); vehicle-to-showroom assignment (intentionally absent).
- **README drift:** `README.md` still mentions a `MarketplaceListing` type (now `GarageVehicle`/`MarketplaceVehicle`),
  a "Developer → Component library" sidebar entry (removed; `/ui-kit` is reached by URL in development), and a
  `text-overline` size (not defined). Fix when the README is next updated.
- The brand name **nuLyft Technologies** comes from the product owner and does not appear in the repository.

---

## 11. Roadmap

| Phase | Status |
|---|---|
| Phase 01: Foundation | Complete |
| Phase 02: Design system and app shell | Complete |
| Phase 03: Dashboard | Complete |
| Phase 04A: Dealers directory | Complete |
| Phase 04B: Dealer detail page | Complete |
| Phase 05: Marketplace monitoring (05A data layer, 05B UI) | Implemented and approved; refinements awaiting final review; not yet committed |
| Phase 06 onwards | Not scoped |

**Phase 06 has not been scoped. Wait for instructions before beginning it.**

Future work may include the remaining admin modules (AI Reels, Settings) and backend integration (HTTP service
implementations), but **none of these are approved implementation tasks yet.**

---

## 12. Development log

Add a new dated entry for each session; don't overwrite earlier entries.

### 11 November 2026
- Completed Phases 01, 02, 03 and 04A (commits `0a52108`, `5b69f59`, `7b7e6ca`, `71863ff`).
- Completed final Phase 04B refinements.
- Restored the original AI reel records to 85.
- Preserved 353 garage vehicles and 160 published vehicles.
- Corrected showroom mock data to one showroom per dealer.
- Added independent dealer/showroom status test scenarios (Sai Krishna Motors: Active dealer, Suspended showroom).
- Improved vehicle photo coverage and attribution (10 alternate photos; XL6 photo corrected).
- Corrected empty-garage pagination.
- Completed screenshot review and visual approval.
- Committed Phase 04B as `843c9c3`.
- Verified typecheck, lint and production build.
- Confirmed a clean Git working tree.
- Created this `HANDOFF.md` (not yet committed).
- Paused development before Phase 05.

### 12 November 2026
- `HANDOFF.md` committed as `dc56245` (`docs: add project handoff document`).
- The product owner manually pushed all commits to the GitHub `main` branch. This was an experiment, not a
  workflow change: Claude Code normally commits and pushes when explicitly instructed.
- A fresh Claude Code session resumed the project successfully using `HANDOFF.md`.
- Verified the repository history (`0a52108` → `5b69f59` → `7b7e6ca` → `71863ff` → `843c9c3` → `dc56245`) and confirmed
  that GitHub `origin/main` points to `dc56245`, the same as local `HEAD`.
- The handoff document is committed and available in the remote repository.
- No application code, mock data or architecture changes.
- Phase 05 has not started; waiting for the product owner's brief.

### 12 November 2026 (Phase 05: Marketplace monitoring)
- Handoff update committed and pushed by Claude Code as `796b7e3`.
- Technical discovery report for the Marketplace (inspection only), then the finalised Phase 05 scope.
- **05A data layer** implemented and approved. An independent check found **4,290 assertions passing**, covering:
  - 300 randomised filter combinations
  - insights totals and rankings
  - faceted counts
  - range validation
  - the model rule and URL parsing
- **05B UI** implemented and approved, including the revised model-filter behaviour.
- **Refinements:** 44px mobile touch targets, and the dealer back link returning to the originating Marketplace view.
- **Browser verification** (1440px and 390px, same-origin iframe):
  - the URL resets the page on every change
  - adding Kia to Hyundai › Creta + i20 gives 42, and removing Hyundai leaves Kia 20
  - range errors are shown inline
  - zero-count selected options stay removable
  - Clear filters returns all 160
  - table and grid show identical rows
  - header sort cycles desc → asc → default
  - previews, reels, dealer links and Back all work, and `?page=99` snaps back
  - Dashboard and dealer detail pages are unchanged, with no console errors
- **Data:** KPI and insight values match the raw records: 160 / 16 / 14 / 9 and garage 353. Top 5: Capital Car
  Bazaar 22, Sai Krishna Motors 18, Eastern Motor Point 15, Garden City Wheels 12, Speedway Autos 12.
- **Mock data unchanged:** `src/mocks`, `public` and `scripts` untouched; fingerprints `54bfedbb34a61495` (reels) and
  `be9082c113569963` (vehicles without photos) match.
- **Checks:** typecheck, lint and production build pass.
- **Screenshots:** `~/Downloads/Revanth/NxtDealer-screenshots/phase-05b/` (01–17).
- **Git status at the time of writing:** Phase 05 changes uncommitted on `main` (last commit `796b7e3`), awaiting the
  product owner's explicit approval to commit and push.

---

## 13. When starting a new Claude Code session

1. Read this entire `HANDOFF.md`.
2. Inspect the latest Git commit and the current working tree (`git log --oneline -5`, `git status`).
3. Verify the repository state against this document (last commit, dataset totals in §7.1, routes in §6).
4. Check whether anything has changed since the last recorded session (new commits, uncommitted files).
5. Summarise the project status and completed work for the product owner.
6. State which phase is complete and what the next agreed step is.
7. **Do not start coding until the product owner gives the next instruction.**

This file provides context. It does not authorise Claude Code to independently choose and start the next phase.

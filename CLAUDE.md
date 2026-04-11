# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

This repository contains **only two files**:

- `imarah.jsx` — a single ~2500-line React component (`export default function MasjidManager`) that implements the entire IMARAH mosque management app.
- `README.md` — product/marketing documentation in Indonesian.

There is **no `package.json`, no Vite config, no `index.html`, no `src/` tree, and no lockfile** in this repo. The README describes a Vite + React 19 setup and `npm run dev`, but that scaffolding does not exist here — `imarah.jsx` is meant to be dropped into a host Vite + React 19 project as the app's root component. If the user asks to "run" or "build" the project, clarify this: either (a) scaffold a Vite + React 19 project and wire `imarah.jsx` in as the default export used by `main.jsx`, or (b) work against an existing host project they point you at. Do not fabricate build commands.

Also note: the README refers to the file as `masjid-manager.jsx`, but the actual filename is `imarah.jsx`. Treat the filename on disk as authoritative.

## Architecture of `imarah.jsx`

The file is deliberately monolithic — all data, components, state, and page renderers live in one module. Understanding its layout matters more than any individual function:

1. **Seed data constants** (lines ~1–235): `initialFinance`, `initialEvents`, `initialInventory`, `initialTickets`, `initialDonatur`, `initialUsahaUnits`, `initialUsahaTransactions`, `initialBookings`, `initialPetaDakwah`, `initialProgramSosial`, `initialJamaah`, plus enums like `MONTHS`, `AREAS`, `DONATUR_TYPES`, `USAHA_CATEGORIES`, `DAKWAH_STATUS`, `DAKWAH_BADGES`, `KONDISI_OPTIONS`. All dates in the seed data are anchored to **2026** (current "today" hardcoded as `2026-04-11`). If you add seed rows, match that timeline.
2. **Shared UI primitives** (lines ~237–400): `Icon` (inline SVG set), `MiniBarChart`, `DonutChart`, `StatCard`, `Modal`, `Field`, `Btn`. All styling is **CSS-in-JS via inline `style={{}}` objects** — there is no Tailwind, no CSS file, no styled-components. Follow the existing inline-style convention when editing.
3. **`MasjidManager` component** (line 401 onward): holds **all** state via `useState` (one hook per slice: `finance`, `events`, `inventory`, `tickets`, `donatur`, `usahaUnits`, `usahaTx`, `bookings`, `jamaah`, plus a pile of per-tab/filter/form states). There is **no reducer, no context, no external store** — mutations go through small `addX` / `updateX` handlers defined inline in the component body (~lines 505–600).
4. **Eight page renderers** as methods on the component: `renderDashboard` (~618), `renderFinance` (~733), `renderEvents` (~1015), `renderInventory` (~1072), `renderUsaha` (~1319), `renderDonatur` (~1656), `renderDakwah` (~1860), `renderJamaah` (~2087). Routing is a single `page` state string switched in the JSX return; `navItems` (~606) is the sidebar source of truth.
5. **Modals**: a single `showModal` string drives which `<Modal>` is open. Each form has its own state slice (`finForm`, `eventForm`, `invForm`, `ticketForm`, `donaturForm`, `bookingForm`, `jamaahForm`) and its own `addX` handler that resets the slice and sets `showModal(null)` on submit.

### Conventions to preserve when editing

- **All user-facing copy is Indonesian.** Keep new labels, placeholders, and toasts in Indonesian to match. Code identifiers are a mix of English and Indonesian (`finance`, `donatur`, `usaha`, `jamaah`, `dakwah`) — follow whichever the surrounding slice already uses.
- **IDs use `Date.now()`** in every `addX` handler. Do not introduce UUIDs unless asked.
- **Finance periods are `YYYY-MM` strings**; helpers `getPrevPeriod`, `periodLabel`, `filterByPeriod`, and `calcByCategory` (around lines 440–467) are the canonical way to slice `finance` by month. Reuse them instead of re-deriving.
- **Money** is stored as plain integer rupiah (no decimals, no separate currency field). Display formatting happens at the render site.
- **Color palettes** for charts are inline arrays (`incomeColors`, `expenseColors`, `eventTypeColors`). The app does not use a theme object.
- **When adding a new module**, mirror the existing pattern: seed constant → state slice in `MasjidManager` → `renderXxx` method → entry in `navItems` → optional modal form + `addXxx` handler. Don't introduce a router, a context, or a separate file unless the user asks for that refactor explicitly.

## Working with this repo

- Prefer editing `imarah.jsx` in place. Do **not** split it into multiple files unless the user explicitly requests that refactor — the single-file layout is intentional and the README documents it.
- There is nothing to lint, test, or build from inside this directory. If the user asks you to verify a change compiles, tell them the repo has no build setup and ask where the host project lives.
- The README contains product context (module descriptions, Jogokariyan inspiration, roadmap) that is useful when deciding how a new feature should behave — consult it before inventing semantics for modules like *Peta Dakwah*, *Infaq Nol Rupiah*, or *Jamaah weekly impressions*.

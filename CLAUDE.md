# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev              # start dev server (localhost:3000)
npm run build            # production build (Next.js static export → out/)
npm run lint             # run ESLint
npm test                 # run unit tests (Vitest)
npm run test:watch       # Vitest in watch mode
npm run test:coverage    # Vitest with V8 coverage report
npm run electron:dev     # Next.js dev + Electron together
npm run electron:build   # static export + electron-builder → dist/
```

To run a single test file: `npx vitest run app/lib/__tests__/dateUtils.test.ts`

## Stack

- **Next.js 16** / **React 19** / **TypeScript 5**
- **Tailwind CSS v4** (PostCSS plugin via `@tailwindcss/postcss`)
- **Electron 34** (desktop) + **Capacitor 6** (Android)
- **Vitest 4** for unit tests — test files live in `app/lib/__tests__/`
- No database — all state persisted to `localStorage` via `app/lib/storage.ts`

## Architecture

Single-page client app (`"use client"`) living entirely in `app/page.tsx`. No server-side data fetching, no API routes, no routing beyond the root page.

**State flow:**
- On mount, `loadState()` reads all keys from `localStorage` and hydrates React state
- Mutations call `store.*` helpers directly (debounced 600 ms for task writes)
- `updateTasks()` is the single mutable gateway for all task state changes; it also schedules the debounced save

**Key modules:**

| Path | Role |
|---|---|
| `app/types.ts` | All shared TypeScript types (`Task`, `TaskType`, `AppState`, etc.) |
| `app/lib/constants.ts` | XP values, level titles, accent presets, default task types, mutable ID counters (`nextTid`/`setTid`) |
| `app/lib/storage.ts` | `loadState()` and `store.*` — thin wrappers around `localStorage` |
| `app/lib/dateUtils.ts` | Date key formatting, workday navigation, flower/level helpers |
| `app/lib/sfx.ts` | Web Audio API sound effects |
| `app/components/TaskCard.tsx` | Single task row — subtasks, drag-and-drop, inline edit |
| `app/components/TypePicker.tsx` | Task type dropdown — renders via `createPortal` into `document.body` to escape stacking contexts |
| `app/components/flowers/` | Six SVG flower components composed via `FlowerPlant.tsx` |
| `app/components/particles/` | Confetti burst — `useParticles` hook + `Particle` component |
| `app/components/SettingsModal.tsx` | Accent color, workdays, sound toggle, custom task types, JSON import/export |
| `app/components/styles.ts` | All `@keyframes` and CSS class definitions injected via `<style>` tag |

**ID management:** Task and subtask IDs come from a module-level counter in `constants.ts`. On load, `setTid(maxId + 1)` scans all stored tasks to resume from the correct value. Tests must call `setTid(0)` in `beforeEach` (handled by `app/lib/__tests__/setup.ts`).

**Date keys:** `getDateKey()` produces `"YYYY-M-D"` strings with a **zero-based month** (matching `Date.getMonth()`). All `localStorage` task maps are keyed by this format.

**Streak logic:** Increments when today's tasks are all cleared, checked against `prevWorkdayKey()` so weekends don't break streaks.

**Flower/plant system:** Each calendar date maps deterministically to one of ten flower types via `getDayFlower(dateKey)` (djb2 hash → seeded float). Plant stage (0–5) is derived from daily completion percentage; a plant "wilts" if ≥3 tasks exist and completion is <20% on a past day.

## Styling conventions

All colors use CSS variables (`var(--color-background-primary)`, `var(--color-text-primary)`, etc.) — never hardcode light-mode hex values. Borders are `1.5px solid`. Border radii: 16px for cards, 10–12px for panels, 99px for pills.

## Build targets

- **Electron:** icon at `build/icon.icns` (macOS) / `build/icon.png` (Windows/Linux). `electron/main.js` calls `app.dock.setIcon()` on macOS so the dock icon works in dev.
- **Capacitor/Android:** run `npx capacitor-assets generate --android` after `npx cap add android` to generate mipmap icons from `assets/icon.png`.

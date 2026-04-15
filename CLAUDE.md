# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # start dev server (localhost:3000)
npm run build     # production build
npm run lint      # run ESLint
```

There is no test suite configured.

## Stack

- **Next.js 16** / **React 19** / **TypeScript 5**
- **Tailwind CSS v4** (PostCSS plugin via `@tailwindcss/postcss`)
- No database — all state is persisted to `localStorage` via `app/lib/storage.ts`

## Architecture

This is a single-page client app (`"use client"`) living entirely in `app/page.tsx`. There is no server-side data
fetching, no API routes, and no routing beyond the root page.

**State flow:**

- On mount, `loadState()` reads all keys from `localStorage` and hydrates React state.
- Mutations call the `store.*` helpers directly (debounced 600 ms for task writes).
- `updateTasks()` is the single mutable gateway for all task state changes; it also schedules the debounced save.

**Key modules:**

| Path                               | Role                                                                                                  |
|------------------------------------|-------------------------------------------------------------------------------------------------------|
| `app/types.ts`                     | All shared TypeScript types (`Task`, `TaskType`, `AppState`, etc.)                                    |
| `app/lib/constants.ts`             | XP values, level titles, accent presets, default task types, mutable ID counters (`nextTid`/`setTid`) |
| `app/lib/storage.ts`               | `loadState()` and `store.*` — thin wrappers around `localStorage`                                     |
| `app/lib/dateUtils.ts`             | Date key formatting, workday navigation, flower/level helpers                                         |
| `app/lib/sfx.ts`                   | Web Audio API sound effects                                                                           |
| `app/components/TaskCard.tsx`      | Renders a single task row with subtasks, drag-and-drop, inline edit                                   |
| `app/components/flowers/`          | Six SVG flower components (`Rose`, `Tulip`, etc.) composed via `FlowerPlant.tsx`                      |
| `app/components/particles/`        | Confetti burst — `useParticles` hook + `Particle` component                                           |
| `app/components/SettingsModal.tsx` | Accent color, custom task types, JSON import/export                                                   |

**ID management:** Task and subtask IDs are assigned from a module-level counter in `constants.ts`. On load,
`setTid(maxId + 1)` scans all stored tasks to resume from the correct value.

**Streak logic:** A workday streak increments when today's tasks are all cleared, checked against `prevWorkdayKey()` so
weekends don't break streaks.

**Flower/plant system:** Each calendar date maps deterministically to one of six flower types via
`getDayFlower(dateKey)`. Plant stage (0–5) is derived from daily completion percentage; a plant "wilts" if ≥3 tasks
exist and completion is <20% on a past day.

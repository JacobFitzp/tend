"use client";

import type { AppState } from '../types';
import { DEFAULT_ACCENT, DEFAULT_TYPES, DEFAULT_WORKDAYS } from './constants';

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

export function loadState(): AppState {
  const t   = lsGet("tasks-v1");
  const x   = lsGet("xp-v1");
  const a   = lsGet("accent-v1");
  const tt  = lsGet("types-v1");
  const st  = lsGet("streak-v1");
  const cel = lsGet("celebrated-v1");
  const ooo = lsGet("ooo-v1");
  const wd  = lsGet("workdays-v1");
  return {
    tasks:      t   ? JSON.parse(t)   : {},
    xp:         x   ? parseInt(x, 10) : 0,
    accent:     a   ? a               : DEFAULT_ACCENT,
    types:      tt  ? JSON.parse(tt)  : DEFAULT_TYPES,
    streak:     st  ? JSON.parse(st)  : { count: 0, lastClearedKey: null },
    celebrated: cel ? JSON.parse(cel) : {},
    ooo:        ooo ? JSON.parse(ooo) : {},
    workdays:   wd  ? JSON.parse(wd)  : DEFAULT_WORKDAYS,
  };
}

export const store = {
  tasks:      (v: AppState["tasks"])      => lsSet("tasks-v1",      JSON.stringify(v)),
  xp:         (v: number)                 => lsSet("xp-v1",         String(v)),
  accent:     (v: string)                 => lsSet("accent-v1",     v),
  types:      (v: AppState["types"])      => lsSet("types-v1",      JSON.stringify(v)),
  streak:     (v: AppState["streak"])     => lsSet("streak-v1",     JSON.stringify(v)),
  celebrated: (v: AppState["celebrated"]) => lsSet("celebrated-v1", JSON.stringify(v)),
  ooo:        (v: AppState["ooo"])        => lsSet("ooo-v1",        JSON.stringify(v)),
  workdays:   (v: AppState["workdays"])  => lsSet("workdays-v1",   JSON.stringify(v)),
  sound:      (v: boolean)               => lsSet("sound-v1",       String(v)),
  theme:      (v: string)                => lsSet("theme-v1",        v),
};

export function loadSoundEnabled(): boolean {
  const v = lsGet("sound-v1");
  return v === null ? true : v === "true";
}

export function loadTheme(): string {
  return lsGet("theme-v1") ?? "system";
}

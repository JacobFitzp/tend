import { DAYS, MONTHS, LEVEL_TITLES } from './constants';
import type { TaskType, StreakState } from '../types';

export function getLevelTitle(l: number): string {
  return LEVEL_TITLES[Math.min(l - 1, LEVEL_TITLES.length - 1)];
}

export function getDateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function isNonWorkday(d: Date, workdays: number[]): boolean {
  return !workdays.includes(d.getDay());
}

export function shiftToWorkday(d: Date, dir: number, workdays: number[]): Date {
  const r = new Date(d);
  let guard = 14;
  while (isNonWorkday(r, workdays) && guard-- > 0) r.setDate(r.getDate() + dir);
  return r;
}

export function nextWorkday(d: Date, workdays: number[]): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + 1);
  return shiftToWorkday(r, 1, workdays);
}

export function prevWorkday(d: Date, workdays: number[]): Date {
  const r = new Date(d);
  r.setDate(r.getDate() - 1);
  return shiftToWorkday(r, -1, workdays);
}

export function prevWorkdayKey(d: Date, workdays: number[]): string {
  return getDateKey(prevWorkday(d, workdays));
}

export function prevNonOOOWorkdayKey(d: Date, ooo: Record<string, boolean>, workdays: number[]): string {
  let cur = prevWorkday(d, workdays);
  let guard = 60;
  while (ooo[getDateKey(cur)] && guard-- > 0) cur = prevWorkday(cur, workdays);
  return getDateKey(cur);
}

export function formatDay(d: Date, workdays: number[]): string {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const t = new Date(d); t.setHours(0, 0, 0, 0);
  const diff = Math.round((t.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === -1 || (diff < -1 && getDateKey(t) === prevWorkdayKey(today, workdays))) return "Yesterday";
  if (diff === 1 || (diff > 1 && getDateKey(t) === getDateKey(nextWorkday(today, workdays)))) return "Tomorrow";
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return h >>> 0;
}

export function seededFloat(seed: number): number {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  s = (s * 0x9e3779b9) >>> 0; s ^= s >>> 16;
  s = (s * 0x85ebca6b) >>> 0; s ^= s >>> 13;
  s = (s * 0xc2b2ae35) >>> 0; s ^= s >>> 16;
  return (s >>> 0) / 0xffffffff;
}

export function getDayFlower(dateKey: string): number {
  return Math.floor(seededFloat(hashStr(dateKey)) * 10);
}

/**
 * Pure streak computation. Call this when the user has just cleared all tasks for today.
 * Returns the next StreakState to persist.
 *
 * Rules:
 *  - lastClearedKey === prev non-OOO workday  → continue streak (count + 1)
 *  - lastClearedKey === today                 → idempotent re-clear, no change
 *  - anything else                            → streak broken, reset to 1
 */
export function computeStreak(
  current: StreakState,
  today: Date,
  ooo: Record<string, boolean>,
  workdays: number[],
): StreakState {
  const todayKey = getDateKey(today);
  const prevWdKey = prevNonOOOWorkdayKey(today, ooo, workdays);
  const newCount =
    current.lastClearedKey === prevWdKey ? current.count + 1
    : current.lastClearedKey === todayKey ? current.count
    : 1;
  return { count: newCount, lastClearedKey: todayKey };
}

export function resolveType(types: TaskType[], id: string): TaskType {
  return types.find(t => t.id === id) ?? types[0];
}

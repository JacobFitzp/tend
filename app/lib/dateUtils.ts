import { DAYS, MONTHS, LEVEL_TITLES } from './constants';
import type { TaskType } from '../types';

export function getLevelTitle(l: number): string {
  return LEVEL_TITLES[Math.min(l - 1, LEVEL_TITLES.length - 1)];
}

export function getDateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function shiftToWeekday(d: Date, dir: number): Date {
  const r = new Date(d);
  while (isWeekend(r)) r.setDate(r.getDate() + dir);
  return r;
}

export function nextWorkday(d: Date): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + 1);
  return shiftToWeekday(r, 1);
}

export function prevWorkday(d: Date): Date {
  const r = new Date(d);
  r.setDate(r.getDate() - 1);
  return shiftToWeekday(r, -1);
}

export function prevWorkdayKey(d: Date): string {
  return getDateKey(prevWorkday(d));
}

export function prevNonOOOWorkdayKey(d: Date, ooo: Record<string, boolean>): string {
  let cur = prevWorkday(d);
  let guard = 60;
  while (ooo[getDateKey(cur)] && guard-- > 0) cur = prevWorkday(cur);
  return getDateKey(cur);
}

export function formatDay(d: Date): string {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const t = new Date(d); t.setHours(0, 0, 0, 0);
  const diff = Math.round((t.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === -1 || (diff < -1 && getDateKey(t) === prevWorkdayKey(today))) return "Yesterday";
  if (diff === 1 || (diff > 1 && getDateKey(t) === getDateKey(nextWorkday(today)))) return "Tomorrow";
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
  return Math.floor(seededFloat(hashStr(dateKey)) * 6);
}

export function resolveType(types: TaskType[], id: string): TaskType {
  return types.find(t => t.id === id) ?? types[0];
}

import type { TaskType } from '../types';

export const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const;
export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const;
export const CONFETTI_COLORS = ["#3B7A3B","#1D9E75","#D85A30","#378ADD","#D4537E","#BA7517","#7AB87A","#06b6d4","#FFD700","#FF6B6B"];
export const XP_PER_TASK = 20;
export const XP_PER_SUBTASK = 8;
export const XP_PER_LEVEL = 500; // base XP required for level 1 → 2; each subsequent level costs 500 more

// XP needed to advance from `level` to `level + 1`
export function xpForLevel(level: number): number { return XP_PER_LEVEL * level; }
// Total XP accumulated at the start of `level` (i.e. threshold to reach it)
export function xpAtLevel(level: number): number { return XP_PER_LEVEL * (level - 1) * level / 2; }
// Current level given total XP (inverse of the quadratic sum)
export function levelFromXp(totalXp: number): number {
  return Math.floor((1 + Math.sqrt(1 + 8 * totalXp / XP_PER_LEVEL)) / 2);
}
export const COMBO_WINDOW = 4000;
export const LEVEL_TITLES = ["Newcomer","Apprentice","Go-getter","Achiever","Hustler","Champion","Legend","Mythic"];
export const DEFAULT_WORKDAYS = [1, 2, 3, 4, 5]; // Mon–Fri
export const DEFAULT_ACCENT = "#3B7A3B";
export const ACCENT_PRESETS = ["#3B7A3B","#1D6FA5","#8B3A8B","#C0392B","#D4537E","#D4860A","#2C7A7A","#555555"];
export const ICON_OPTIONS = ["◇","◈","⬡","⌥","★","●","▲","■","♦","✦","⚑","⊕","⊗","❖"];
export const DEFAULT_TYPES: TaskType[] = [
  { id:"general", label:"General",   icon:"◇", color:"#5A7A5A", bg:"#EEF5EE", border:"#C8D8C8" },
  { id:"meeting", label:"Meeting",   icon:"⬡", color:"#185FA5", bg:"#E6F1FB", border:"#B5D4F4" },
  { id:"pr",      label:"PR Review", icon:"⌥", color:"#7A4A00", bg:"#FFF3E0", border:"#FFCC80" },
  { id:"pickup",  label:"Picked up", icon:"◈", color:"#993556", bg:"#FBEAF0", border:"#F4C0D1" },
];

// Mutable ID counters — use functions to allow mutation from outside this module
let _tid = 0;
let _pid = 0;
export function nextTid(): number { return _tid++; }
export function setTid(n: number): void { _tid = n; }
export function nextPid(): number { return _pid++; }

export function tbg(t: TaskType): string { return t.bg ?? (t.color + "18"); }
export function tborder(t: TaskType): string { return t.border ?? (t.color + "44"); }

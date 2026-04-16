import { describe, it, expect } from 'vitest';
import {
  xpForLevel, xpAtLevel, levelFromXp,
  nextTid, setTid, nextPid,
  tbg, tborder,
  XP_PER_LEVEL, LEVEL_TITLES,
} from '../constants';
import { getLevelTitle } from '../dateUtils';
import type { TaskType } from '../../types';

// setTid(0) is called before each test by setup.ts

describe('xpForLevel', () => {
  it('level 1 costs 500 XP', () => expect(xpForLevel(1)).toBe(500));
  it('level 2 costs 1000 XP', () => expect(xpForLevel(2)).toBe(1000));
  it('scales linearly: level N = N * 500', () => {
    for (const n of [3, 5, 10]) {
      expect(xpForLevel(n)).toBe(n * XP_PER_LEVEL);
    }
  });
});

describe('xpAtLevel', () => {
  it('level 1 threshold is 0', () => expect(xpAtLevel(1)).toBe(0));
  it('level 2 threshold is 500', () => expect(xpAtLevel(2)).toBe(500));
  it('level 3 threshold is 1500', () => expect(xpAtLevel(3)).toBe(1500));
  it('level 4 threshold is 3000', () => expect(xpAtLevel(4)).toBe(3000));
});

describe('levelFromXp', () => {
  it('0 XP → level 1', () => expect(levelFromXp(0)).toBe(1));
  it('499 XP → level 1 (just under threshold)', () => expect(levelFromXp(499)).toBe(1));
  it('500 XP → level 2 (exact threshold)', () => expect(levelFromXp(500)).toBe(2));
  it('501 XP → level 2 (just over threshold)', () => expect(levelFromXp(501)).toBe(2));
  it('1499 XP → level 2', () => expect(levelFromXp(1499)).toBe(2));
  it('1500 XP → level 3', () => expect(levelFromXp(1500)).toBe(3));
  it('large XP value stays finite and positive', () => {
    const level = levelFromXp(1_000_000);
    expect(level).toBeGreaterThan(0);
    expect(Number.isFinite(level)).toBe(true);
  });
});

describe('levelFromXp / xpAtLevel round-trip', () => {
  it('xpAtLevel(levelFromXp(xp) + 1) is always > xp', () => {
    for (const xp of [0, 499, 500, 1499, 1500, 2999, 3000, 10000, 50000]) {
      expect(xpAtLevel(levelFromXp(xp) + 1)).toBeGreaterThan(xp);
    }
  });
});

describe('getLevelTitle', () => {
  it('level 1 → first title', () => expect(getLevelTitle(1)).toBe(LEVEL_TITLES[0]));
  it('level 8 → last title', () => expect(getLevelTitle(8)).toBe(LEVEL_TITLES[7]));
  it('level beyond array is clamped to last title', () => {
    expect(getLevelTitle(99)).toBe(LEVEL_TITLES[LEVEL_TITLES.length - 1]);
  });
});

describe('nextTid / setTid', () => {
  it('first call returns 0', () => {
    expect(nextTid()).toBe(0);
  });
  it('increments on each call', () => {
    expect(nextTid()).toBe(0);
    expect(nextTid()).toBe(1);
    expect(nextTid()).toBe(2);
  });
  it('setTid resets the counter to a given value', () => {
    nextTid(); nextTid();
    setTid(10);
    expect(nextTid()).toBe(10);
  });
});

describe('nextPid', () => {
  it('increments by 1 on each call', () => {
    const a = nextPid();
    expect(nextPid()).toBe(a + 1);
    expect(nextPid()).toBe(a + 2);
  });
});

describe('tbg', () => {
  const base: TaskType = { id: 'x', label: 'X', icon: '◇', color: '#AABBCC' };

  it('returns t.bg when present', () => {
    expect(tbg({ ...base, bg: '#FFEEDD' })).toBe('#FFEEDD');
  });
  it('falls back to color + "18" when bg is absent', () => {
    expect(tbg(base)).toBe('#AABBCC18');
  });
});

describe('tborder', () => {
  const base: TaskType = { id: 'x', label: 'X', icon: '◇', color: '#AABBCC' };

  it('returns t.border when present', () => {
    expect(tborder({ ...base, border: '#112233' })).toBe('#112233');
  });
  it('falls back to color + "44" when border is absent', () => {
    expect(tborder(base)).toBe('#AABBCC44');
  });
});

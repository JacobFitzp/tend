import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import {
  getLevelTitle,
  getDateKey, isNonWorkday, shiftToWorkday,
  nextWorkday, prevWorkday, prevWorkdayKey, prevNonOOOWorkdayKey,
  formatDay, hashStr, seededFloat, getDayFlower, resolveType,
} from '../dateUtils';
import type { TaskType } from '../../types';

const MON_FRI = [1, 2, 3, 4, 5];

// Build a local-midnight Date without timezone ambiguity
function d(year: number, month: number, day: number): Date {
  return new Date(year, month, day);
}

describe('getLevelTitle', () => {
  it('level 1 returns "Newcomer"', () => expect(getLevelTitle(1)).toBe('Newcomer'));
  it('level 8 returns "Mythic"', () => expect(getLevelTitle(8)).toBe('Mythic'));
  it('clamped: level 99 returns last title', () => expect(getLevelTitle(99)).toBe('Mythic'));
});

describe('getDateKey', () => {
  it('formats year-month-day correctly', () => {
    expect(getDateKey(d(2024, 0, 1))).toBe('2024-0-1');
  });
  it('month is zero-based (January = 0)', () => {
    expect(getDateKey(d(2026, 0, 15))).toBe('2026-0-15');
  });
  it('December is month 11', () => {
    expect(getDateKey(d(2024, 11, 31))).toBe('2024-11-31');
  });
});

describe('isNonWorkday', () => {
  // April 2026: Sun 12, Mon 13, Sat 18
  it('Sunday (0) is a non-workday on Mon–Fri schedule', () => {
    expect(isNonWorkday(d(2026, 3, 12), MON_FRI)).toBe(true);
  });
  it('Saturday (6) is a non-workday on Mon–Fri schedule', () => {
    expect(isNonWorkday(d(2026, 3, 18), MON_FRI)).toBe(true);
  });
  it('Monday (1) is a workday on Mon–Fri schedule', () => {
    expect(isNonWorkday(d(2026, 3, 13), MON_FRI)).toBe(false);
  });
  it('returns false when workdays includes Saturday', () => {
    expect(isNonWorkday(d(2026, 3, 18), [1, 2, 3, 4, 5, 6])).toBe(false);
  });
});

describe('shiftToWorkday', () => {
  it('returns same date when already a workday', () => {
    expect(getDateKey(shiftToWorkday(d(2026, 3, 13), 1, MON_FRI))).toBe('2026-3-13'); // Monday
  });
  it('shifts Saturday forward to Monday (dir=1)', () => {
    expect(getDateKey(shiftToWorkday(d(2026, 3, 18), 1, MON_FRI))).toBe('2026-3-20');
  });
  it('shifts Sunday forward to Monday (dir=1)', () => {
    expect(getDateKey(shiftToWorkday(d(2026, 3, 19), 1, MON_FRI))).toBe('2026-3-20');
  });
  it('shifts Saturday backward to Friday (dir=-1)', () => {
    expect(getDateKey(shiftToWorkday(d(2026, 3, 18), -1, MON_FRI))).toBe('2026-3-17');
  });
  it('does not throw when workdays is empty (guard exits after 14 iterations)', () => {
    expect(() => shiftToWorkday(d(2026, 3, 13), 1, [])).not.toThrow();
  });
});

describe('nextWorkday', () => {
  it('Friday → Monday (skips weekend)', () => {
    expect(getDateKey(nextWorkday(d(2026, 3, 17), MON_FRI))).toBe('2026-3-20');
  });
  it('Thursday → Friday', () => {
    expect(getDateKey(nextWorkday(d(2026, 3, 16), MON_FRI))).toBe('2026-3-17');
  });
  it('works at month boundary: Jan 30 (Fri 2026) → Feb 2 (Mon)', () => {
    expect(getDateKey(nextWorkday(d(2026, 0, 30), MON_FRI))).toBe('2026-1-2');
  });
});

describe('prevWorkday', () => {
  it('Monday → Friday (skips weekend)', () => {
    expect(getDateKey(prevWorkday(d(2026, 3, 13), MON_FRI))).toBe('2026-3-10');
  });
  it('Wednesday → Tuesday', () => {
    expect(getDateKey(prevWorkday(d(2026, 3, 15), MON_FRI))).toBe('2026-3-14');
  });
  it('Sunday → Friday', () => {
    expect(getDateKey(prevWorkday(d(2026, 3, 19), MON_FRI))).toBe('2026-3-17');
  });
});

describe('prevWorkdayKey', () => {
  it('returns a string in getDateKey format', () => {
    expect(prevWorkdayKey(d(2026, 3, 15), MON_FRI)).toBe('2026-3-14'); // Wed → Tue
  });
  it('Monday returns key for previous Friday', () => {
    expect(prevWorkdayKey(d(2026, 3, 13), MON_FRI)).toBe('2026-3-10');
  });
});

describe('prevNonOOOWorkdayKey', () => {
  it('returns previous workday when no OOO entries exist', () => {
    // Wed Apr 15 → Tue Apr 14
    expect(prevNonOOOWorkdayKey(d(2026, 3, 15), {}, MON_FRI)).toBe('2026-3-14');
  });
  it('skips a single OOO day', () => {
    const ooo: Record<string, boolean> = { '2026-3-14': true }; // Tue Apr 14 is OOO
    // Wed Apr 15 → skip Tue Apr 14 → Mon Apr 13
    expect(prevNonOOOWorkdayKey(d(2026, 3, 15), ooo, MON_FRI)).toBe('2026-3-13');
  });
  it('skips a chain of consecutive OOO days', () => {
    const ooo: Record<string, boolean> = { '2026-3-14': true, '2026-3-13': true };
    // Wed Apr 15 → skip Tue Apr 14 → skip Mon Apr 13 → Fri Apr 10
    expect(prevNonOOOWorkdayKey(d(2026, 3, 15), ooo, MON_FRI)).toBe('2026-3-10');
  });
});

describe('formatDay', () => {
  // Fix "today" to Tuesday 2026-04-14 for baseline tests
  beforeAll(() => vi.useFakeTimers());
  afterAll(() => vi.useRealTimers());

  describe('when today is Tuesday April 14 2026', () => {
    beforeEach(() => vi.setSystemTime(new Date(2026, 3, 14, 12, 0, 0)));

    it('today → "Today"', () => {
      expect(formatDay(d(2026, 3, 14), MON_FRI)).toBe('Today');
    });
    it('yesterday (diff = -1) → "Yesterday"', () => {
      expect(formatDay(d(2026, 3, 13), MON_FRI)).toBe('Yesterday');
    });
    it('tomorrow (diff = +1) → "Tomorrow"', () => {
      expect(formatDay(d(2026, 3, 15), MON_FRI)).toBe('Tomorrow');
    });
    it('two days ago → full date format', () => {
      // Sunday Apr 12 is not the prev workday (Mon Apr 13 is), so "Yesterday" does not apply
      expect(formatDay(d(2026, 3, 12), MON_FRI)).toBe('Sun, Apr 12');
    });
    it('far-future date → full date format', () => {
      expect(formatDay(d(2026, 3, 24), MON_FRI)).toBe('Fri, Apr 24');
    });
  });

  describe('when today is Monday April 13 2026 — "Yesterday" via diff < -1', () => {
    beforeEach(() => vi.setSystemTime(new Date(2026, 3, 13, 12, 0, 0)));

    it('Friday Apr 10 (diff = -3) → "Yesterday" because it is prevWorkday(Monday)', () => {
      expect(formatDay(d(2026, 3, 10), MON_FRI)).toBe('Yesterday');
    });
  });

  describe('when today is Friday April 17 2026 — "Tomorrow" via diff > 1', () => {
    beforeEach(() => vi.setSystemTime(new Date(2026, 3, 17, 12, 0, 0)));

    it('Monday Apr 20 (diff = +3) → "Tomorrow" because it is nextWorkday(Friday)', () => {
      expect(formatDay(d(2026, 3, 20), MON_FRI)).toBe('Tomorrow');
    });
  });
});

describe('hashStr', () => {
  it('same string always produces the same hash', () => {
    expect(hashStr('hello')).toBe(hashStr('hello'));
  });
  it('empty string produces a consistent hash', () => {
    expect(hashStr('')).toBe(hashStr(''));
  });
  it('different strings produce different hashes', () => {
    expect(hashStr('a')).not.toBe(hashStr('b'));
  });
  it('result is always a non-negative 32-bit integer', () => {
    for (const s of ['', 'a', 'hello', '2026-3-14']) {
      const h = hashStr(s);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(0xffffffff);
    }
  });
});

describe('seededFloat', () => {
  it('returns a value in [0, 1)', () => {
    for (const seed of [0, 1, 42, 12345, 0xdeadbeef]) {
      const v = seededFloat(seed);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it('same seed always returns the same value', () => {
    expect(seededFloat(42)).toBe(seededFloat(42));
  });
  it('different seeds return different values', () => {
    expect(seededFloat(1)).not.toBe(seededFloat(2));
  });
});

describe('getDayFlower', () => {
  it('returns an integer in [0, 9]', () => {
    for (const key of ['2026-0-1', '2026-3-14', '2024-11-31']) {
      const f = getDayFlower(key);
      expect(Number.isInteger(f)).toBe(true);
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThanOrEqual(9);
    }
  });
  it('same dateKey always returns the same flower', () => {
    expect(getDayFlower('2026-3-14')).toBe(getDayFlower('2026-3-14'));
  });
  it('different keys can produce different flowers', () => {
    const flowers = new Set(['2026-0-1', '2026-1-1', '2026-2-1', '2026-3-1'].map(getDayFlower));
    expect(flowers.size).toBeGreaterThan(1);
  });
});

describe('resolveType', () => {
  const types: TaskType[] = [
    { id: 'general', label: 'General', icon: '◇', color: '#5A7A5A' },
    { id: 'meeting', label: 'Meeting', icon: '⬡', color: '#185FA5' },
  ];

  it('returns the matching type when id exists', () => {
    expect(resolveType(types, 'meeting').label).toBe('Meeting');
  });
  it('returns types[0] as fallback when id is not found', () => {
    expect(resolveType(types, 'nonexistent')).toBe(types[0]);
  });
  it('returns types[0] when array has one entry and id does not match', () => {
    expect(resolveType([types[0]], 'missing')).toBe(types[0]);
  });
});

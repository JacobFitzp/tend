// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadState, loadSoundEnabled, store } from '../storage';
import { DEFAULT_ACCENT, DEFAULT_TYPES, DEFAULT_WORKDAYS } from '../constants';

beforeEach(() => {
  localStorage.clear();
});

describe('loadState — defaults when localStorage is empty', () => {
  it('tasks defaults to {}', () => {
    expect(loadState().tasks).toEqual({});
  });
  it('xp defaults to 0', () => {
    expect(loadState().xp).toBe(0);
  });
  it('accent defaults to DEFAULT_ACCENT', () => {
    expect(loadState().accent).toBe(DEFAULT_ACCENT);
  });
  it('types defaults to DEFAULT_TYPES', () => {
    expect(loadState().types).toEqual(DEFAULT_TYPES);
  });
  it('streak defaults to { count: 0, lastClearedKey: null }', () => {
    expect(loadState().streak).toEqual({ count: 0, lastClearedKey: null });
  });
  it('celebrated defaults to {}', () => {
    expect(loadState().celebrated).toEqual({});
  });
  it('ooo defaults to {}', () => {
    expect(loadState().ooo).toEqual({});
  });
  it('workdays defaults to DEFAULT_WORKDAYS', () => {
    expect(loadState().workdays).toEqual(DEFAULT_WORKDAYS);
  });
});

describe('store.* round-trips', () => {
  it('tasks', () => {
    const tasks = { '2026-3-14': [{ id: 1, title: 'Test', type: 'general', done: false, important: false, subtasks: [], link: null }] };
    store.tasks(tasks);
    expect(loadState().tasks).toEqual(tasks);
  });
  it('xp', () => {
    store.xp(1234);
    expect(loadState().xp).toBe(1234);
  });
  it('accent', () => {
    store.accent('#FF0000');
    expect(loadState().accent).toBe('#FF0000');
  });
  it('types', () => {
    const types = [{ id: 'custom', label: 'Custom', icon: '★', color: '#123456' }];
    store.types(types);
    expect(loadState().types).toEqual(types);
  });
  it('streak', () => {
    const streak = { count: 5, lastClearedKey: '2026-3-10' };
    store.streak(streak);
    expect(loadState().streak).toEqual(streak);
  });
  it('celebrated', () => {
    const celebrated = { '2026-3-14': true };
    store.celebrated(celebrated);
    expect(loadState().celebrated).toEqual(celebrated);
  });
  it('ooo', () => {
    const ooo = { '2026-3-14': true };
    store.ooo(ooo);
    expect(loadState().ooo).toEqual(ooo);
  });
  it('workdays', () => {
    store.workdays([1, 2, 3]);
    expect(loadState().workdays).toEqual([1, 2, 3]);
  });
});

describe('loadSoundEnabled', () => {
  it('returns true when key is absent (default on)', () => {
    expect(loadSoundEnabled()).toBe(true);
  });
  it('returns true when stored value is "true"', () => {
    store.sound(true);
    expect(loadSoundEnabled()).toBe(true);
  });
  it('returns false when stored value is "false"', () => {
    store.sound(false);
    expect(loadSoundEnabled()).toBe(false);
  });
});

describe('resilience — localStorage throws', () => {
  it('loadState returns defaults when getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    expect(() => loadState()).not.toThrow();
    expect(loadState().xp).toBe(0);
  });
  it('store.tasks does not throw when setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded');
    });
    expect(() => store.tasks({})).not.toThrow();
  });
});

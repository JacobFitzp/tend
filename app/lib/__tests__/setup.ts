import { beforeEach, afterEach, vi } from 'vitest';
import { setTid } from '../constants';

beforeEach(() => {
  setTid(0);
});

afterEach(() => {
  vi.restoreAllMocks();
});

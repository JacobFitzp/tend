"use client";
import { useState, useCallback } from 'react';
import { CONFETTI_COLORS, nextPid } from '../../lib/constants';
import type { ParticleData } from '../../types';

export function useParticles() {
  const [particles, setP] = useState<ParticleData[]>([]);
  const burst = useCallback((x: number, y: number, count = 18, size = 1, colors?: string[]) => {
    const palette = colors ?? CONFETTI_COLORS;
    const n: ParticleData[] = Array.from({ length: count }, () => ({
      id: nextPid(),
      x, y, size,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));
    setP(p => [...p, ...n]);
  }, []);
  const remove = useCallback((id: number) => setP(p => p.filter(x => x.id !== id)), []);
  return { particles, burst, remove };
}

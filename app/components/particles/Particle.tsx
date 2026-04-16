"use client";
import { useState, useEffect, useRef } from 'react';

interface ParticleProps {
  x: number;
  y: number;
  color: string;
  size?: number;
  onDone: () => void;
}

export function Particle({ x, y, color, size = 1, onDone }: ParticleProps) {
  const [pos, setPos] = useState({ x, y, opacity: 1, rot: 0 });
  const [init] = useState(() => ({
    vx: (Math.random() - 0.5) * 10 * size,
    vy: -(Math.random() * 8 + 3) * size,
    rot: Math.random() * 360,
    sz: (Math.random() * 8 + 5) * size,
  }));
  const r = useRef({ x, y, vx: init.vx, vy: init.vy, opacity: 1, f: 0, rot: init.rot });
  useEffect(() => {
    const tick = () => {
      const s = r.current;
      s.x += s.vx; s.y += s.vy; s.vy += 0.3; s.opacity -= 0.018; s.rot += s.vx * 2;
      if (s.opacity <= 0) { onDone(); return; }
      setPos({ x: s.x, y: s.y, opacity: s.opacity, rot: s.rot });
      s.f = requestAnimationFrame(tick);
    };
    r.current.f = requestAnimationFrame(tick);
    const anim = r.current;
    return () => cancelAnimationFrame(anim.f);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{
      position: "fixed", left: pos.x, top: pos.y,
      width: init.sz, height: init.sz * 0.6,
      borderRadius: "2px", background: color, opacity: pos.opacity,
      pointerEvents: "none", zIndex: 9999,
      transform: `translate(-50%,-50%) rotate(${pos.rot}deg)`,
    }}/>
  );
}

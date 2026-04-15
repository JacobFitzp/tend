"use client";

export interface FlowerProps {
  stage: number;
  dead: boolean;
}

export const POT = (
  <g>
    <rect x="32" y="88" width="36" height="5" rx="2" fill="#C0895A"/>
    <path d="M28 93 Q34 108 50 108 Q66 108 72 93 Z" fill="#D4A574" stroke="#C0895A" strokeWidth="1"/>
    <ellipse cx="50" cy="90" rx="20" ry="4" fill="#8B5E3C"/>
  </g>
);

interface StemProps { h?: number; sway?: number; }
export function Stem({ h = 30, sway = 0 }: StemProps) {
  return <path d={`M50 88 Q${50 + sway} ${88 - h / 2} 50 ${88 - h}`} stroke="#388E3C" strokeWidth="3" fill="none" strokeLinecap="round"/>;
}

interface LeafProps { cx: number; cy: number; angle: number; size?: number; }
export function Leaf({ cx, cy, angle, size = 1 }: LeafProps) {
  const r = angle * Math.PI / 180;
  const ex = cx + Math.cos(r) * 14 * size, ey = cy + Math.sin(r) * 10 * size;
  const mx = (cx + ex) / 2, my = (cy + ey) / 2;
  return <ellipse cx={mx} cy={my} rx={8 * size} ry={5 * size} fill="#66BB6A" stroke="#388E3C" strokeWidth="1" transform={`rotate(${angle} ${mx} ${my})`}/>;
}

interface PetalsProps { angles: number[]; r: number; cy: number; rx: number; ry: number; fill: string; stroke: string; }
export function Petals({ angles, r, cy: pcy, rx, ry, fill, stroke: ps }: PetalsProps) {
  return <>{angles.map(a => {
    const cx2 = 50 + Math.cos(a * Math.PI / 180) * r;
    const cy2 = pcy + Math.sin(a * Math.PI / 180) * r;
    return <ellipse key={a} cx={cx2} cy={cy2} rx={rx} ry={ry} fill={fill} stroke={ps} strokeWidth="0.5" transform={`rotate(${a} ${cx2} ${cy2})`}/>;
  })}</>;
}

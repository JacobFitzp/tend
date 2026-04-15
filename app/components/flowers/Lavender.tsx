"use client";
import { POT, type FlowerProps } from './shared';

// A lavender spike: narrow pill shape with floret markings, rotated from its base
function Spike({ bx, by, angle = 0, h = 18, w = 5 }: { bx: number; by: number; angle?: number; h?: number; w?: number }) {
  return (
    <g transform={`rotate(${angle} ${bx} ${by})`}>
      <rect x={bx - w / 2} y={by - h} width={w} height={h} rx={w / 2} fill="#B39DDB" stroke="#7B1FA2" strokeWidth="0.6"/>
      <ellipse cx={bx} cy={by - h * 0.72} rx={w * 0.32} ry={1.1} fill="#CE93D8" opacity="0.75"/>
      <ellipse cx={bx} cy={by - h * 0.48} rx={w * 0.32} ry={1.1} fill="#CE93D8" opacity="0.65"/>
      <ellipse cx={bx} cy={by - h * 0.24} rx={w * 0.32} ry={1.0} fill="#D1B3E8" opacity="0.5"/>
    </g>
  );
}

// Grey-green leaf shaped for lavender foliage
function LavLeaf({ cx, cy, angle, size = 1 }: { cx: number; cy: number; angle: number; size?: number }) {
  const r = angle * Math.PI / 180;
  const ex = cx + Math.cos(r) * 12 * size;
  const ey = cy + Math.sin(r) * 8 * size;
  const mx = (cx + ex) / 2, my = (cy + ey) / 2;
  return <ellipse cx={mx} cy={my} rx={6 * size} ry={3.5 * size} fill="#8FAF78" stroke="#5C7A4E" strokeWidth="0.8" transform={`rotate(${angle} ${mx} ${my})`}/>;
}

const STEM = "#6B8F5E";

export function Lavender({ stage, dead }: FlowerProps) {
  if (dead) return (
    <g>
      <line x1="50" y1="88" x2="50" y2="62" stroke={STEM} strokeWidth="2.5" strokeLinecap="round" opacity="0.55"/>
      <LavLeaf cx={50} cy={78} angle={-18} size={0.7}/>
      <Spike bx={50} by={62} h={12} w={4} angle={12}/>
      {POT}
    </g>
  );

  if (stage === 0) return (
    <g>
      {POT}
      <ellipse cx="50" cy="87" rx="4" ry="3" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/>
    </g>
  );

  if (stage === 1) return (
    <g>
      <line x1="50" y1="88" x2="50" y2="76" stroke={STEM} strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="50" cy="73" rx="2.5" ry="5" fill="#B39DDB" stroke="#7B1FA2" strokeWidth="0.6"/>
      {POT}
    </g>
  );

  if (stage === 2) return (
    <g>
      <line x1="50" y1="88" x2="50" y2="58" stroke={STEM} strokeWidth="2.5" strokeLinecap="round"/>
      <LavLeaf cx={50} cy={80} angle={-18} size={0.85}/>
      <LavLeaf cx={50} cy={80} angle={18} size={0.85}/>
      <Spike bx={50} by={58} h={16} w={5}/>
      {POT}
    </g>
  );

  if (stage === 3) return (
    <g>
      <line x1="50" y1="88" x2="50" y2="54" stroke={STEM} strokeWidth="2.5" strokeLinecap="round"/>
      <LavLeaf cx={50} cy={78} angle={-20}/>
      <LavLeaf cx={50} cy={78} angle={20}/>
      <LavLeaf cx={50} cy={70} angle={-16} size={0.85}/>
      <LavLeaf cx={50} cy={70} angle={16} size={0.85}/>
      <Spike bx={45} by={56} angle={-10} h={15} w={4.5}/>
      <Spike bx={50} by={54} angle={0}  h={18} w={5}/>
      <Spike bx={55} by={56} angle={10} h={15} w={4.5}/>
      {POT}
    </g>
  );

  if (stage === 4) return (
    <g>
      <line x1="50" y1="88" x2="50" y2="50" stroke={STEM} strokeWidth="2.5" strokeLinecap="round"/>
      <LavLeaf cx={50} cy={76} angle={-22}/>
      <LavLeaf cx={50} cy={76} angle={22}/>
      <LavLeaf cx={50} cy={68} angle={-18} size={0.9}/>
      <LavLeaf cx={50} cy={68} angle={18} size={0.9}/>
      <Spike bx={41} by={56} angle={-18} h={13} w={4}/>
      <Spike bx={46} by={53} angle={-9}  h={16} w={4.5}/>
      <Spike bx={50} by={51} angle={0}   h={19} w={5}/>
      <Spike bx={54} by={53} angle={9}   h={16} w={4.5}/>
      <Spike bx={59} by={56} angle={18}  h={13} w={4}/>
      {POT}
    </g>
  );

  // Stage 5: full plant — 7 spikes
  return (
    <g>
      <line x1="50" y1="88" x2="50" y2="46" stroke={STEM} strokeWidth="2.5" strokeLinecap="round"/>
      <LavLeaf cx={50} cy={74} angle={-24}/>
      <LavLeaf cx={50} cy={74} angle={24}/>
      <LavLeaf cx={50} cy={66} angle={-20} size={0.9}/>
      <LavLeaf cx={50} cy={66} angle={20} size={0.9}/>
      <LavLeaf cx={50} cy={58} angle={-14} size={0.75}/>
      <LavLeaf cx={50} cy={58} angle={14} size={0.75}/>
      <Spike bx={38} by={58} angle={-24} h={11} w={3.5}/>
      <Spike bx={43} by={54} angle={-16} h={14} w={4}/>
      <Spike bx={47} by={51} angle={-8}  h={17} w={4.5}/>
      <Spike bx={50} by={49} angle={0}   h={20} w={5}/>
      <Spike bx={53} by={51} angle={8}   h={17} w={4.5}/>
      <Spike bx={57} by={54} angle={16}  h={14} w={4}/>
      <Spike bx={62} by={58} angle={24}  h={11} w={3.5}/>
      {POT}
    </g>
  );
}

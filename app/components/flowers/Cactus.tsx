"use client";
import { POT, type FlowerProps } from './shared';

const sp = (x: number, y: number, d: 1|-1) => <>
  <line x1={x} y1={y} x2={x+d*7} y2={y-2} stroke="#FFECB3" strokeWidth="0.9" strokeLinecap="round"/>
  <line x1={x} y1={y} x2={x+d*7} y2={y+2} stroke="#FFECB3" strokeWidth="0.9" strokeLinecap="round"/>
  <line x1={x} y1={y} x2={x+d*8} y2={y} stroke="#FFECB3" strokeWidth="0.9" strokeLinecap="round"/>
</>;

const col = (yTop: number) =>
  `M43 88 L43 ${yTop+7} Q43 ${yTop} 50 ${yTop} Q57 ${yTop} 57 ${yTop+7} L57 88 Z`;

export function Cactus({ stage, dead }: FlowerProps) {
  if (dead) return <g>
    <path d="M50 88 Q39 81 38 71 Q37 62 43 57" stroke="#795548" strokeWidth="14" fill="none" strokeLinecap="round"/>
    {POT}
  </g>;
  if (stage===0) return <g>{POT}<ellipse cx="50" cy="86" rx="5" ry="3.5" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/></g>;
  if (stage===1) return <g>
    <ellipse cx="50" cy="83" rx="8" ry="6" fill="#4CAF50" stroke="#388E3C" strokeWidth="1.5"/>
    {sp(42,83,-1)}{sp(58,83,1)}
    {POT}
  </g>;
  if (stage===2) return <g>
    <path d={col(73)} fill="#388E3C" stroke="#2E7D32" strokeWidth="1"/>
    <line x1="50" y1="73" x2="50" y2="88" stroke="#4CAF50" strokeWidth="1.5" opacity="0.35"/>
    {sp(43,78,-1)}{sp(57,78,1)}{sp(43,84,-1)}{sp(57,84,1)}
    <ellipse cx="50" cy="73" rx="7" ry="3.5" fill="#66BB6A"/>
    {POT}
  </g>;
  if (stage===3) return <g>
    <path d="M43 77 Q32 74 32 65 Q32 57 39 56" stroke="#388E3C" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d={col(64)} fill="#388E3C" stroke="#2E7D32" strokeWidth="1"/>
    <line x1="50" y1="64" x2="50" y2="88" stroke="#4CAF50" strokeWidth="1.5" opacity="0.35"/>
    {sp(43,68,-1)}{sp(57,68,1)}{sp(43,76,-1)}{sp(57,76,1)}{sp(43,83,-1)}{sp(57,83,1)}
    {sp(32,62,-1)}{sp(32,68,-1)}
    <ellipse cx="50" cy="64" rx="7" ry="3.5" fill="#66BB6A"/>
    <ellipse cx="39" cy="56" rx="5" ry="3" fill="#66BB6A"/>
    {POT}
  </g>;
  if (stage===4) return <g>
    <path d="M43 74 Q31 71 31 61 Q31 52 38 51" stroke="#388E3C" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M57 78 Q69 75 69 65 Q69 56 62 55" stroke="#388E3C" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d={col(55)} fill="#388E3C" stroke="#2E7D32" strokeWidth="1"/>
    <line x1="50" y1="55" x2="50" y2="88" stroke="#4CAF50" strokeWidth="1.5" opacity="0.35"/>
    {sp(43,59,-1)}{sp(57,59,1)}{sp(43,67,-1)}{sp(57,67,1)}{sp(43,75,-1)}{sp(57,75,1)}{sp(43,83,-1)}{sp(57,83,1)}
    {sp(31,58,-1)}{sp(31,65,-1)}{sp(69,62,1)}{sp(69,68,1)}
    <ellipse cx="50" cy="55" rx="7" ry="3.5" fill="#66BB6A"/>
    <ellipse cx="38" cy="51" rx="5" ry="3" fill="#66BB6A"/>
    <ellipse cx="62" cy="55" rx="5" ry="3" fill="#66BB6A"/>
    {POT}
  </g>;
  return <g>
    <path d="M43 70 Q29 67 29 55 Q29 45 37 44" stroke="#388E3C" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d="M57 74 Q71 71 71 59 Q71 49 63 48" stroke="#388E3C" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <path d={col(46)} fill="#388E3C" stroke="#2E7D32" strokeWidth="1"/>
    <line x1="50" y1="46" x2="50" y2="88" stroke="#4CAF50" strokeWidth="1.5" opacity="0.35"/>
    {sp(43,50,-1)}{sp(57,50,1)}{sp(43,58,-1)}{sp(57,58,1)}{sp(43,66,-1)}{sp(57,66,1)}
    {sp(43,74,-1)}{sp(57,74,1)}{sp(43,82,-1)}{sp(57,82,1)}
    {sp(29,51,-1)}{sp(29,58,-1)}{sp(71,55,1)}{sp(71,62,1)}
    <ellipse cx="50" cy="46" rx="7" ry="3.5" fill="#66BB6A"/>
    <ellipse cx="37" cy="44" rx="5" ry="3" fill="#66BB6A"/>
    <ellipse cx="63" cy="48" rx="5" ry="3" fill="#66BB6A"/>
    {[0,60,120,180,240,300].map(a => { const r=a*Math.PI/180; return <ellipse key={a} cx={50+Math.cos(r)*8} cy={46+Math.sin(r)*8} rx={5} ry={3} fill="#FF5252" stroke="#D32F2F" strokeWidth="0.5" transform={`rotate(${a} ${50+Math.cos(r)*8} ${46+Math.sin(r)*8})`}/>; })}
    <circle cx="50" cy="46" r="5" fill="#FFD740"/>
    {POT}
  </g>;
}

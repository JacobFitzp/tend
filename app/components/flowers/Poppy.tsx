"use client";
import { POT, Stem, Leaf, Petals, type FlowerProps } from './shared';

export function Poppy({ stage, dead }: FlowerProps) {
  if (dead) return <g><Stem h={26} sway={12}/><Leaf cx={50} cy={74} angle={-35} size={0.7}/>{POT}</g>;
  if (stage===0) return <g>{POT}<ellipse cx="50" cy="86" rx="5" ry="3.5" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/></g>;
  if (stage===1) return <g><line x1="50" y1="88" x2="50" y2="76" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="50" cy="74" rx="3" ry="4" fill="#66BB6A"/>{POT}</g>;
  if (stage===2) return <g>
    <path d="M50 88 Q56 74 60 64 Q62 57 56 52" stroke="#388E3C" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <ellipse cx="55" cy="50" rx="5" ry="7" fill="#FFAB40" stroke="#EF6C00" strokeWidth="1" transform="rotate(20 55 50)"/>
    {POT}
  </g>;
  if (stage===3) return <g>
    <Stem h={28}/><Leaf cx={50} cy={76} angle={-42} size={0.9}/>
    <Petals angles={[0,90,180,270]} r={9} cy={59} rx={8} ry={5.5} fill="#FFA726" stroke="#E65100"/>
    <circle cx="50" cy="59" r="5" fill="#1A237E"/>
    {POT}
  </g>;
  if (stage===4) return <g>
    <Stem h={32}/><Leaf cx={50} cy={72} angle={-40}/><Leaf cx={50} cy={70} angle={34} size={0.9}/>
    <Petals angles={[0,60,120,180,240,300]} r={12} cy={55} rx={9} ry={6} fill="#FF7043" stroke="#BF360C"/>
    <circle cx="50" cy="55" r="7" fill="#1A237E" stroke="#0D0D5E" strokeWidth="1"/>
    {[0,45,90,135,180,225,270,315].map(a => { const r=a*Math.PI/180; return <line key={a} x1="50" y1="55" x2={50+Math.cos(r)*6} y2={55+Math.sin(r)*6} stroke="#FDD835" strokeWidth="0.8"/>; })}
    {POT}
  </g>;
  return <g>
    <Stem h={36}/><Leaf cx={50} cy={68} angle={-42}/><Leaf cx={50} cy={65} angle={38} size={0.9}/><Leaf cx={50} cy={76} angle={-55} size={0.7}/>
    <Petals angles={[0,45,90,135,180,225,270,315]} r={13} cy={50} rx={10} ry={7} fill="#FF5722" stroke="#BF360C"/>
    <Petals angles={[22,67,112,157,202,247,292,337]} r={9} cy={50} rx={8} ry={5} fill="#FF7043" stroke="#BF360C"/>
    <circle cx="50" cy="50" r="8" fill="#1A237E" stroke="#0D0D5E" strokeWidth="1.5"/>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => { const r=a*Math.PI/180; return <line key={a} x1="50" y1="50" x2={50+Math.cos(r)*7} y2={50+Math.sin(r)*7} stroke="#FDD835" strokeWidth="0.8"/>; })}
    {POT}
  </g>;
}

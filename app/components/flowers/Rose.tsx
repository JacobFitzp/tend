"use client";
import { POT, Stem, Leaf, Petals, type FlowerProps } from './shared';

export function Rose({ stage, dead }: FlowerProps) {
  if (dead) return <g><Stem h={28} sway={8}/><Leaf cx={50} cy={72} angle={-40} size={0.7}/>{POT}</g>;
  if (stage===0) return <g>{POT}<ellipse cx="50" cy="86" rx="5" ry="3.5" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/></g>;
  if (stage===1) return <g><line x1="50" y1="88" x2="50" y2="76" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/><circle cx="50" cy="74" r="3" fill="#E57373"/>{POT}</g>;
  if (stage===2) return <g><Stem h={24}/><Leaf cx={50} cy={76} angle={-35}/><circle cx="50" cy="63" r="6" fill="#EF9A9A" stroke="#E53935" strokeWidth="1.5"/>{POT}</g>;
  if (stage===3) return <g><Stem h={30}/><Leaf cx={50} cy={72} angle={-30}/><Leaf cx={50} cy={68} angle={30} size={0.8}/><Petals angles={[0,60,120,180,240,300]} r={9} cy={58} rx={7} ry={5} fill="#EF9A9A" stroke="#C62828"/><circle cx="50" cy="58" r="5" fill="#E53935"/>{POT}</g>;
  if (stage===4) return <g><Stem h={34}/><Leaf cx={50} cy={70} angle={-35}/><Leaf cx={50} cy={66} angle={25} size={0.9}/><Petals angles={[0,45,90,135,180,225,270,315]} r={12} cy={54} rx={8} ry={5.5} fill="#EF5350" stroke="#B71C1C"/><Petals angles={[22,67,112,157,202,247,292,337]} r={8} cy={54} rx={6} ry={4} fill="#E53935" stroke="#B71C1C"/><circle cx="50" cy="54" r="5" fill="#B71C1C"/>{POT}</g>;
  return <g><Stem h={38}/><Leaf cx={50} cy={68} angle={-30}/><Leaf cx={50} cy={62} angle={28} size={0.9}/><Leaf cx={50} cy={75} angle={-50} size={0.7}/><Petals angles={[0,36,72,108,144,180,216,252,288,324]} r={13} cy={50} rx={9} ry={6} fill="#FF1744" stroke="#B71C1C"/><Petals angles={[18,54,90,126,162,198,234,270,306,342]} r={9} cy={50} rx={7} ry={4.5} fill="#E53935" stroke="#B71C1C"/><Petals angles={[0,60,120,180,240,300]} r={5} cy={50} rx={5} ry={3.5} fill="#B71C1C" stroke="#B71C1C"/><circle cx="50" cy="50" r="4" fill="#880E4F"/>{POT}</g>;
}

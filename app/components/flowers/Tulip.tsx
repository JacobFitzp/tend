"use client";
import { POT, Stem, Leaf, type FlowerProps } from './shared';

export function Tulip({ stage, dead }: FlowerProps) {
  if (dead) return <g><Stem h={28} sway={10}/><Leaf cx={50} cy={74} angle={-35} size={0.8}/>{POT}</g>;
  if (stage===0) return <g>{POT}<ellipse cx="50" cy="86" rx="5" ry="3.5" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/></g>;
  if (stage===1) return <g><line x1="50" y1="88" x2="50" y2="76" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="50" cy="73" rx="4" ry="5" fill="#F48FB1"/>{POT}</g>;
  if (stage===2) return <g><Stem h={26}/><path d="M43 66 Q50 56 57 66 Q50 70 43 66Z" fill="#F06292" stroke="#AD1457" strokeWidth="1"/>{POT}</g>;
  if (stage===3) return <g><Stem h={30}/><Leaf cx={50} cy={74} angle={-40} size={1.1}/><Leaf cx={50} cy={72} angle={40} size={1.1}/><path d="M42 62 Q50 50 58 62 Q54 68 50 69 Q46 68 42 62Z" fill="#E91E63" stroke="#880E4F" strokeWidth="1.5"/><path d="M44 58 Q50 52 56 58" fill="none" stroke="#F48FB1" strokeWidth="1"/>{POT}</g>;
  if (stage===4) return <g><Stem h={34}/><Leaf cx={50} cy={70} angle={-42} size={1.2}/><Leaf cx={50} cy={68} angle={42} size={1.2}/><path d="M40 56 Q44 44 50 42 Q56 44 60 56 Q55 65 50 67 Q45 65 40 56Z" fill="#E91E63" stroke="#880E4F" strokeWidth="2"/><path d="M44 50 Q50 46 56 50" fill="none" stroke="#F48FB1" strokeWidth="1.2"/><path d="M42 54 Q50 62 58 54" fill="none" stroke="#F48FB1" strokeWidth="1"/>{POT}</g>;
  return <g><Stem h={38}/><Leaf cx={50} cy={66} angle={-44} size={1.3}/><Leaf cx={50} cy={64} angle={44} size={1.3}/><path d="M38 52 Q40 36 50 34 Q60 36 62 52 Q58 62 50 65 Q42 62 38 52Z" fill="#F50057" stroke="#880E4F" strokeWidth="2"/><path d="M38 52 Q36 40 42 36" fill="none" stroke="#FF80AB" strokeWidth="1.5" strokeLinecap="round"/><path d="M62 52 Q64 40 58 36" fill="none" stroke="#FF80AB" strokeWidth="1.5" strokeLinecap="round"/><path d="M44 46 Q50 42 56 46" fill="none" stroke="#FF80AB" strokeWidth="1.5"/><ellipse cx="50" cy="44" rx="4" ry="5" fill="#FF4081" opacity="0.5"/>{POT}</g>;
}

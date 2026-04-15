"use client";
import { POT, Stem, Petals, type FlowerProps } from './shared';

export function Orchid({ stage, dead }: FlowerProps) {
  if (dead) return <g><Stem h={26} sway={10}/>{POT}</g>;
  if (stage===0) return <g>{POT}<ellipse cx="50" cy="86" rx="5" ry="3.5" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/></g>;
  if (stage===1) return <g><line x1="50" y1="88" x2="50" y2="76" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="50" cy="73" rx="3" ry="5" fill="#F8BBD0"/>{POT}</g>;
  if (stage===2) return <g><Stem h={26}/><ellipse cx="50" cy="61" rx="5" ry="8" fill="#F8BBD0" stroke="#F48FB1" strokeWidth="1"/>{POT}</g>;
  if (stage===3) return <g>
    <Stem h={30}/>
    <Petals angles={[270,342,54,126,198]} r={10} cy={57} rx={8} ry={5} fill="#F8BBD0" stroke="#F48FB1"/>
    <path d="M44 60 Q42 68 50 70 Q58 68 56 60" fill="#E91E63" stroke="#AD1457" strokeWidth="0.8"/>
    <ellipse cx="50" cy="56" rx="4" ry="5" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.8"/>
    {POT}
  </g>;
  if (stage===4) return <g>
    <Stem h={34}/>
    <Petals angles={[270,342,54,126,198]} r={12} cy={53} rx={9} ry={5.5} fill="#F8BBD0" stroke="#F48FB1"/>
    <path d="M43 57 Q40 66 50 68 Q60 66 57 57" fill="#E91E63" stroke="#AD1457" strokeWidth="1"/>
    <circle cx="47" cy="63" r="1.5" fill="#AD1457"/><circle cx="53" cy="63" r="1.5" fill="#AD1457"/>
    <ellipse cx="50" cy="52" rx="4.5" ry="5.5" fill="#FFF9C4" stroke="#F9A825" strokeWidth="0.8"/>
    {POT}
  </g>;
  return <g>
    <Stem h={38}/>
    <path d="M50 70 Q60 67 63 62" stroke="#388E3C" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <ellipse cx="63" cy="60" rx="4" ry="6" fill="#F8BBD0" stroke="#F48FB1" strokeWidth="0.8" transform="rotate(15 63 60)"/>
    <Petals angles={[270,342,54,126,198]} r={13} cy={48} rx={10} ry={6} fill="#F48FB1" stroke="#E91E63"/>
    <path d="M42 53 Q39 63 50 65 Q61 63 58 53" fill="#E91E63" stroke="#AD1457" strokeWidth="1"/>
    <circle cx="46" cy="59" r="1.8" fill="#AD1457"/><circle cx="54" cy="59" r="1.8" fill="#AD1457"/><circle cx="50" cy="62" r="1.5" fill="#AD1457"/>
    <ellipse cx="50" cy="46" rx="5" ry="6" fill="#FFF9C4" stroke="#F9A825" strokeWidth="1"/>
    {POT}
  </g>;
}

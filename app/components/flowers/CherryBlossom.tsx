"use client";
import { POT, Stem, Leaf, type FlowerProps } from './shared';

function cbp(cx2: number, cy2: number, r: number) {
  return [0,72,144,216,288].map(a => {
    const ex = cx2 + Math.cos(a * Math.PI / 180) * r;
    const ey = cy2 + Math.sin(a * Math.PI / 180) * r;
    return <ellipse key={a} cx={ex} cy={ey} rx="4" ry="2.5" fill="#FCE4EC" stroke="#F48FB1" strokeWidth="0.5" transform={`rotate(${a} ${ex} ${ey})`}/>;
  });
}

export function CherryBlossom({ stage, dead }: FlowerProps) {
  if (dead) return <g><Stem h={30} sway={8}/><Leaf cx={50} cy={70} angle={-30} size={0.7}/>{POT}</g>;
  if (stage===0) return <g>{POT}<ellipse cx="50" cy="86" rx="5" ry="3.5" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/></g>;
  if (stage===1) return <g><line x1="50" y1="88" x2="50" y2="76" stroke="#795548" strokeWidth="3" strokeLinecap="round"/><circle cx="50" cy="73" r="3" fill="#F8BBD9"/>{POT}</g>;
  if (stage===2) return <g><line x1="50" y1="88" x2="50" y2="68" stroke="#795548" strokeWidth="3.5" strokeLinecap="round"/><line x1="50" y1="78" x2="40" y2="70" stroke="#795548" strokeWidth="2.5" strokeLinecap="round"/>{[0,72,144,216,288].map(a=>{const cx2=50+Math.cos(a*Math.PI/180)*8,cy2=62+Math.sin(a*Math.PI/180)*8;return <ellipse key={a} cx={cx2} cy={cy2} rx="4" ry="3" fill="#F8BBD9" stroke="#F48FB1" strokeWidth="0.5" transform={`rotate(${a} ${cx2} ${cy2})`}/>;})}<circle cx="50" cy="62" r="3" fill="#F06292"/>{POT}</g>;
  if (stage===3) return <g><line x1="50" y1="88" x2="50" y2="64" stroke="#5D4037" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="80" x2="37" y2="70" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/><line x1="50" y1="76" x2="63" y2="66" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>{[[50,58],[38,66],[62,64]].map(([cx2,cy2])=><g key={`${cx2}${cy2}`}>{cbp(cx2!,cy2!,7)}<circle cx={cx2} cy={cy2} r="2.5" fill="#F06292"/></g>)}{POT}</g>;
  if (stage===4) return <g><line x1="50" y1="88" x2="50" y2="60" stroke="#4E342E" strokeWidth="5" strokeLinecap="round"/><line x1="50" y1="80" x2="34" y2="68" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round"/><line x1="50" y1="74" x2="66" y2="62" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round"/><line x1="50" y1="68" x2="38" y2="58" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round"/>{[[50,54],[34,64],[66,58],[40,52],[60,54]].map(([cx2,cy2])=><g key={`${cx2}${cy2}`}>{cbp(cx2!,cy2!,8)}<circle cx={cx2} cy={cy2} r="3" fill="#E91E63"/></g>)}{POT}</g>;
  return <g><line x1="50" y1="88" x2="50" y2="56" stroke="#3E2723" strokeWidth="5" strokeLinecap="round"/><line x1="50" y1="80" x2="30" y2="66" stroke="#3E2723" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="72" x2="70" y2="60" stroke="#3E2723" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="66" x2="34" y2="54" stroke="#3E2723" strokeWidth="3" strokeLinecap="round"/><line x1="50" y1="66" x2="66" y2="54" stroke="#3E2723" strokeWidth="3" strokeLinecap="round"/>{[[50,50],[30,62],[70,56],[36,48],[64,48],[50,62]].map(([cx2,cy2])=><g key={`${cx2}${cy2}`}>{cbp(cx2!,cy2!,9)}<circle cx={cx2} cy={cy2} r="3" fill="#E91E63"/></g>)}{POT}</g>;
}

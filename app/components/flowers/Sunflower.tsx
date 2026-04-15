"use client";
import { POT, Stem, Leaf, Petals, type FlowerProps } from './shared';

export function Sunflower({ stage, dead }: FlowerProps) {
  if (dead) return <g><Stem h={32} sway={10}/><Leaf cx={50} cy={68} angle={-40} size={0.7}/>{POT}</g>;
  if (stage===0) return <g>{POT}<ellipse cx="50" cy="86" rx="5" ry="3.5" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/></g>;
  if (stage===1) return <g><line x1="50" y1="88" x2="50" y2="76" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/><circle cx="50" cy="73" r="3" fill="#FDD835"/>{POT}</g>;
  if (stage===2) return <g><Stem h={26}/><Leaf cx={50} cy={74} angle={-35}/><circle cx="50" cy="61" r="7" fill="#F9A825" stroke="#F57F17" strokeWidth="1.5"/>{POT}</g>;
  if (stage===3) return <g><Stem h={32}/><Leaf cx={50} cy={70} angle={-30}/><Leaf cx={50} cy={66} angle={25} size={0.8}/><Petals angles={[0,45,90,135,180,225,270,315]} r={10} cy={56} rx={7} ry={4} fill="#FDD835" stroke="#F9A825"/><circle cx="50" cy="56" r="7" fill="#5D4037"/>{POT}</g>;
  if (stage===4) return <g><Stem h={36}/><Leaf cx={50} cy={66} angle={-35}/><Leaf cx={50} cy={62} angle={28} size={0.9}/><Petals angles={[0,30,60,90,120,150,180,210,240,270,300,330]} r={13} cy={52} rx={8} ry={4.5} fill="#FDD835" stroke="#F9A825"/><circle cx="50" cy="52" r="9" fill="#4E342E"/><circle cx="50" cy="52" r="6" fill="#3E2723"/>{POT}</g>;
  return <g><Stem h={40}/><Leaf cx={50} cy={64} angle={-32}/><Leaf cx={50} cy={60} angle={26} size={0.9}/><Leaf cx={50} cy={72} angle={-55} size={0.7}/><Petals angles={[0,27,54,81,108,135,162,189,216,243,270,297,324,351]} r={15} cy={48} rx={9} ry={5} fill="#FFEE58" stroke="#FBC02D"/><Petals angles={[13,40,67,94,121,148,175,202,229,256,283,310,337]} r={11} cy={48} rx={7} ry={4} fill="#FDD835" stroke="#FBC02D"/><circle cx="50" cy="48" r="10" fill="#4E342E"/><circle cx="50" cy="48" r="7" fill="#3E2723"/>{POT}</g>;
}

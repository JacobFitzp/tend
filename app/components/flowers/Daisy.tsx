"use client";
import { POT, Stem, Leaf, Petals, type FlowerProps } from './shared';

export function Daisy({ stage, dead }: FlowerProps) {
  if (dead) return <g><Stem h={26} sway={9}/><Leaf cx={50} cy={74} angle={-30} size={0.7}/>{POT}</g>;
  if (stage===0) return <g>{POT}<ellipse cx="50" cy="86" rx="5" ry="3.5" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/></g>;
  if (stage===1) return <g><line x1="50" y1="88" x2="50" y2="76" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round"/><circle cx="50" cy="73" r="3.5" fill="#FDD835"/>{POT}</g>;
  if (stage===2) return <g><Stem h={24}/><Leaf cx={50} cy={76} angle={-30}/><Petals angles={[0,60,120,180,240,300]} r={9} cy={63} rx={5} ry={3} fill="white" stroke="#ddd"/><circle cx="50" cy="63" r="5" fill="#FDD835" stroke="#F9A825" strokeWidth="1"/>{POT}</g>;
  if (stage===3) return <g><Stem h={28}/><Leaf cx={50} cy={72} angle={-32}/><Leaf cx={50} cy={70} angle={28} size={0.8}/><Petals angles={[0,36,72,108,144,180,216,252,288,324]} r={11} cy={59} rx={6} ry={3.5} fill="white" stroke="#E0E0E0"/><circle cx="50" cy="59" r="6" fill="#FDD835" stroke="#F9A825" strokeWidth="1.5"/>{POT}</g>;
  if (stage===4) return <g><Stem h={32}/><Leaf cx={50} cy={68} angle={-35}/><Leaf cx={50} cy={65} angle={30} size={0.9}/><Petals angles={[0,30,60,90,120,150,180,210,240,270,300,330]} r={13} cy={55} rx={7} ry={4} fill="white" stroke="#E0E0E0"/><circle cx="50" cy="55" r="7" fill="#FDD835" stroke="#F9A825" strokeWidth="2"/>{POT}</g>;
  return (
    <g>
      <Stem h={36}/><Leaf cx={50} cy={64} angle={-36}/><Leaf cx={50} cy={61} angle={32} size={0.9}/><Leaf cx={50} cy={72} angle={-55} size={0.7}/>
      <Petals angles={[0,27,54,81,108,135,162,189,216,243,270,297,324,351]} r={14} cy={51} rx={8} ry={4.5} fill="white" stroke="#F5F5F5"/>
      <Petals angles={[13,40,67,94,121,148,175,202,229,256,283,310,337]} r={10} cy={51} rx={6} ry={3.5} fill="#F5F5F5" stroke="#E0E0E0"/>
      <circle cx="50" cy="51" r="8" fill="#FDD835" stroke="#F9A825" strokeWidth="2"/>
      {[0,3,-3,4,-4,2,-2,4].map((dx,i) => <circle key={i} cx={50+dx} cy={51+[0,-3,2,3,-3,4,-4,3][i]} r="1.2" fill="#F57F17"/>)}
      {POT}
    </g>
  );
}

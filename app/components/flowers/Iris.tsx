"use client";
import { POT, type FlowerProps } from './shared';

export function Iris({ stage, dead }: FlowerProps) {
  if (dead) return <g>
    <path d="M44 88 Q42 75 42 64" stroke="#8D6E63" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M56 88 Q60 75 58 64" stroke="#8D6E63" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="61" rx="5" ry="7" fill="#8D6E63" stroke="#6D4C41" strokeWidth="1" transform="rotate(10 50 61)"/>
    {POT}
  </g>;
  if (stage===0) return <g>{POT}<ellipse cx="50" cy="86" rx="5" ry="3.5" fill="#8B6914" stroke="#6B4A2A" strokeWidth="1"/></g>;
  if (stage===1) return <g>
    <path d="M48 88 Q46 79 47 72" stroke="#4CAF50" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    {POT}
  </g>;
  if (stage===2) return <g>
    <path d="M44 88 Q42 76 43 64" stroke="#388E3C" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M56 88 Q58 76 57 64" stroke="#388E3C" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="59" rx="4" ry="8" fill="#CE93D8" stroke="#9C27B0" strokeWidth="1"/>
    {POT}
  </g>;
  if (stage===3) return <g>
    <path d="M44 88 Q41 73 42 59" stroke="#388E3C" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M56 88 Q59 73 58 59" stroke="#388E3C" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="64" rx="8" ry="5" fill="#7B1FA2" stroke="#6A1B9A" strokeWidth="1"/>
    <ellipse cx="41" cy="60" rx="8" ry="5" fill="#7B1FA2" stroke="#6A1B9A" strokeWidth="1" transform="rotate(-55 41 60)"/>
    <ellipse cx="59" cy="60" rx="8" ry="5" fill="#7B1FA2" stroke="#6A1B9A" strokeWidth="1" transform="rotate(55 59 60)"/>
    <ellipse cx="50" cy="51" rx="4.5" ry="9" fill="#CE93D8" stroke="#9C27B0" strokeWidth="1"/>
    <ellipse cx="42" cy="54" rx="4.5" ry="9" fill="#BA68C8" stroke="#9C27B0" strokeWidth="1" transform="rotate(-28 42 54)"/>
    <ellipse cx="58" cy="54" rx="4.5" ry="9" fill="#BA68C8" stroke="#9C27B0" strokeWidth="1" transform="rotate(28 58 54)"/>
    <ellipse cx="50" cy="60" rx="3" ry="2" fill="#FDD835"/>
    <circle cx="50" cy="57" r="3" fill="#9C27B0"/>
    {POT}
  </g>;
  if (stage===4) return <g>
    <path d="M43 88 Q40 70 40 52" stroke="#388E3C" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
    <path d="M57 88 Q60 70 60 52" stroke="#388E3C" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="62" rx="9" ry="6" fill="#7B1FA2" stroke="#6A1B9A" strokeWidth="1"/>
    <ellipse cx="39" cy="57" rx="9" ry="6" fill="#6A1B9A" stroke="#4A148C" strokeWidth="1" transform="rotate(-55 39 57)"/>
    <ellipse cx="61" cy="57" rx="9" ry="6" fill="#6A1B9A" stroke="#4A148C" strokeWidth="1" transform="rotate(55 61 57)"/>
    <ellipse cx="50" cy="47" rx="5" ry="10" fill="#E1BEE7" stroke="#9C27B0" strokeWidth="1"/>
    <ellipse cx="41" cy="51" rx="5" ry="10" fill="#CE93D8" stroke="#9C27B0" strokeWidth="1" transform="rotate(-28 41 51)"/>
    <ellipse cx="59" cy="51" rx="5" ry="10" fill="#CE93D8" stroke="#9C27B0" strokeWidth="1" transform="rotate(28 59 51)"/>
    <ellipse cx="50" cy="58" rx="3.5" ry="2" fill="#FDD835" stroke="#F57F17" strokeWidth="0.5"/>
    <circle cx="50" cy="55" r="3.5" fill="#9C27B0" stroke="#6A1B9A" strokeWidth="1"/>
    {POT}
  </g>;
  return <g>
    <path d="M42 88 Q38 67 38 48" stroke="#388E3C" strokeWidth="6" fill="none" strokeLinecap="round"/>
    <path d="M58 88 Q62 67 62 48" stroke="#388E3C" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
    <path d="M50 88 Q48 76 49 65" stroke="#388E3C" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="59" rx="10" ry="6.5" fill="#7B1FA2" stroke="#6A1B9A" strokeWidth="1"/>
    <ellipse cx="37" cy="54" rx="10" ry="6.5" fill="#6A1B9A" stroke="#4A148C" strokeWidth="1" transform="rotate(-52 37 54)"/>
    <ellipse cx="63" cy="54" rx="10" ry="6.5" fill="#6A1B9A" stroke="#4A148C" strokeWidth="1" transform="rotate(52 63 54)"/>
    <ellipse cx="50" cy="43" rx="5.5" ry="11" fill="#E1BEE7" stroke="#9C27B0" strokeWidth="1"/>
    <ellipse cx="40" cy="47" rx="5.5" ry="11" fill="#CE93D8" stroke="#9C27B0" strokeWidth="1" transform="rotate(-26 40 47)"/>
    <ellipse cx="60" cy="47" rx="5.5" ry="11" fill="#CE93D8" stroke="#9C27B0" strokeWidth="1" transform="rotate(26 60 47)"/>
    <ellipse cx="50" cy="56" rx="4" ry="2.5" fill="#FDD835" stroke="#F57F17" strokeWidth="0.5"/>
    <circle cx="50" cy="52" r="4" fill="#9C27B0" stroke="#6A1B9A" strokeWidth="1"/>
    {POT}
  </g>;
}

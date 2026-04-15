"use client";
import { ACCENT_PRESETS } from '../lib/constants';

interface ColourPickerProps {
  accent: string;
  onChange: (color: string) => void;
}

export function ColourPicker({ accent, onChange }: ColourPickerProps) {
  return (
    <div>
      <div style={{fontSize:12,fontWeight:500,color:"#555",marginBottom:10}}>Primary colour</div>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        {ACCENT_PRESETS.map(c => (
          <button key={c} onClick={() => onChange(c)} style={{width:26,height:26,borderRadius:"50%",background:c,border:accent===c?"3px solid #fff":"2px solid transparent",boxShadow:accent===c?`0 0 0 2px ${c}`:"none",cursor:"pointer",flexShrink:0}}/>
        ))}
        <input type="color" value={accent} onChange={e => onChange(e.target.value)} style={{width:26,height:26,borderRadius:"50%",border:"none",padding:0,cursor:"pointer",background:"transparent"}}/>
      </div>
    </div>
  );
}

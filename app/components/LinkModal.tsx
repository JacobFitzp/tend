"use client";
import { useState } from 'react';
import type { TaskLink } from '../types';

interface LinkModalProps {
  existing: TaskLink | null;
  accent: string;
  onSave: (url: string, label: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function LinkModal({ existing, accent, onSave, onRemove, onClose }: LinkModalProps) {
  const [url, setUrl] = useState(existing?.url ?? "");
  const [label, setLabel] = useState(existing?.label ?? "");
  const save = () => {
    if (!url.trim()) return;
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    onSave(u, label.trim() || u);
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)"}}/>
      <div style={{position:"relative",zIndex:1,background:"white",borderRadius:16,padding:24,width:"100%",maxWidth:320,boxSizing:"border-box"}} onClick={e => e.stopPropagation()}>
        <div style={{fontSize:15,fontWeight:500,color:"#111",marginBottom:16}}>{existing ? "Edit link" : "Attach a link"}</div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:12,color:"#666",marginBottom:4}}>Label (optional)</div>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Design brief" style={{width:"100%",fontSize:14,padding:"8px 10px",borderRadius:8,border:"1px solid #ddd",color:"#111",boxSizing:"border-box",outline:"none"}}/>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,color:"#666",marginBottom:4}}>URL</div>
          <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && save()} placeholder="https://..." style={{width:"100%",fontSize:14,padding:"8px 10px",borderRadius:8,border:"1px solid #ddd",color:"#111",boxSizing:"border-box",outline:"none"}} autoFocus/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
          {existing ? <button onClick={onRemove} style={{padding:"8px 14px",borderRadius:8,border:"1px solid #fcc",background:"#fff5f5",color:"#c00",fontSize:13,cursor:"pointer"}}>Remove</button> : <div/>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #ddd",background:"transparent",fontSize:13,color:"#555",cursor:"pointer"}}>Cancel</button>
            <button onClick={save} style={{padding:"8px 16px",borderRadius:8,border:"none",background:accent,color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer"}}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

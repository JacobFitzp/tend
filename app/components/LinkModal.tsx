"use client";
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const save = () => {
    if (!url.trim()) return;
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    onSave(u, label.trim() || u);
  };

  const fieldLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: "var(--color-text-tertiary)",
    marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.3px",
  };

  const input: React.CSSProperties = {
    width: "100%", fontSize: 13, padding: "8px 10px",
    borderRadius: 10, border: "1.5px solid var(--color-border-secondary)",
    color: "var(--color-text-primary)", background: "var(--color-background-secondary)",
    boxSizing: "border-box", outline: "none", fontFamily: "var(--font-sans)",
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)"}}/>
      <div
        style={{position:"relative",zIndex:1,background:"var(--color-background-primary)",borderRadius:16,padding:24,width:"100%",maxWidth:320,boxSizing:"border-box",border:"1.5px solid var(--color-border-secondary)",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:700,color:"var(--color-text-primary)",letterSpacing:"-0.3px"}}>{existing ? "Edit link" : "Attach a link"}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--color-text-tertiary)",lineHeight:1,opacity:0.7}}>×</button>
        </div>

        <div style={{marginBottom:12}}>
          <div style={fieldLabel}>Label (optional)</div>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Design brief" style={input}/>
        </div>
        <div style={{marginBottom:20}}>
          <div style={fieldLabel}>URL</div>
          <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && save()} placeholder="https://..." style={input} autoFocus/>
        </div>

        <div style={{display:"flex",gap:8,justifyContent:"space-between"}}>
          {existing
            ? <button onClick={onRemove} style={{fontSize:12,padding:"5px 12px",borderRadius:99,border:"1.5px solid #f5c0c0",background:"transparent",color:"#c00",cursor:"pointer"}}>Remove</button>
            : <div/>}
          <div style={{display:"flex",gap:6}}>
            <button onClick={onClose} style={{fontSize:12,padding:"5px 12px",borderRadius:99,border:"1.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",cursor:"pointer"}}>Cancel</button>
            <button onClick={save} style={{fontSize:12,padding:"5px 12px",borderRadius:99,border:"none",background:accent,color:"#fff",cursor:"pointer",fontWeight:600}}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

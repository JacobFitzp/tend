"use client";
import { useState, useRef } from 'react';
import type { TaskType, AppState } from '../types';
import { ICON_OPTIONS, tbg, tborder } from '../lib/constants';
import { loadState } from '../lib/storage';
import { ColourPicker } from './ColourPicker';

interface SettingsModalProps {
  accent: string;
  onAccentChange: (a: string) => void;
  types: TaskType[];
  onTypesChange: (types: TaskType[]) => void;
  onImport: (data: Partial<AppState>) => void;
  soundEnabled: boolean;
  onSoundToggle: (v: boolean) => void;
  onClose: () => void;
}

export function SettingsModal({ accent, onAccentChange, types, onTypesChange, onImport, soundEnabled, onSoundToggle, onClose }: SettingsModalProps) {
  const [localTypes, setLocalTypes] = useState<TaskType[]>(types);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragIdx = useRef<number | null>(null);
  const [draft, setDraft] = useState<Partial<TaskType>>({});
  const [ioTab, setIoTab] = useState<"export" | "import">("export");
  const [importText, setImportText] = useState("");
  const [importErr, setImportErr] = useState("");

  const persist = (next: TaskType[]) => { setLocalTypes(next); onTypesChange(next); };

  const commit = () => {
    if (!draft.label?.trim()) return;
    const base = editing === "new" ? { id: "custom_" + Date.now() } : localTypes[editing as number];
    const entry: TaskType = { ...base, ...(draft as TaskType), label: draft.label.trim() };
    persist(editing === "new"
      ? [...localTypes, entry]
      : localTypes.map((t, i) => i === editing ? entry : t));
    setEditing(null);
  };

  const doExport = () => {
    const s = loadState();
    const data = { tasks: s.tasks, xp: s.xp, accent: s.accent, types: s.types, streak: s.streak };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `mytasks-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const doImport = () => {
    try {
      const p = JSON.parse(importText) as Partial<AppState>;
      if (!p.tasks) throw new Error("Missing tasks");
      onImport(p); setImportErr(""); onClose();
    } catch (e) {
      setImportErr("Invalid JSON: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "5px 14px", borderRadius: 99, border: "none",
    background: active ? accent : "transparent",
    color: active ? "#fff" : "#555",
    fontSize: 12, cursor: "pointer", fontWeight: active ? 500 : 400,
  });

  return (
    <div style={{position:"fixed",inset:0,zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)"}}/>
      <div style={{position:"relative",zIndex:1,background:"white",borderRadius:16,padding:24,width:"100%",maxWidth:360,boxSizing:"border-box",maxHeight:"85vh",overflowY:"auto"}} onClick={e => e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:500,color:"#111"}}>Settings</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#aaa",lineHeight:1}}>×</button>
        </div>

        <div style={{marginBottom:24}}>
          <ColourPicker accent={accent} onChange={onAccentChange}/>
        </div>

        <div style={{marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:12,fontWeight:500,color:"#555"}}>Sound effects</div>
          <button
            onClick={() => onSoundToggle(!soundEnabled)}
            style={{
              width:40, height:22, borderRadius:99, border:"none", cursor:"pointer", padding:0,
              background: soundEnabled ? accent : "#ccc",
              position:"relative", transition:"background 0.2s",
            }}
          >
            <span style={{
              position:"absolute", top:3, left: soundEnabled ? 21 : 3,
              width:16, height:16, borderRadius:"50%", background:"white",
              transition:"left 0.2s", display:"block",
            }}/>
          </button>
        </div>

        <div>
          <div style={{fontSize:12,fontWeight:500,color:"#555",marginBottom:10}}>Task types</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
            {localTypes.map((t, i) => (
              <div
                key={t.id}
                draggable
                onDragStart={() => { dragIdx.current = i; }}
                onDragOver={e => { e.preventDefault(); setDragOverIdx(i); }}
                onDrop={e => {
                  e.preventDefault();
                  if (dragIdx.current === null || dragIdx.current === i) { dragIdx.current = null; setDragOverIdx(null); return; }
                  const next = [...localTypes];
                  const [item] = next.splice(dragIdx.current, 1); next.splice(i, 0, item);
                  persist(next);
                  dragIdx.current = null; setDragOverIdx(null);
                }}
                onDragEnd={() => { dragIdx.current = null; setDragOverIdx(null); }}
                style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:`1px solid ${dragOverIdx===i?"#bbb":"#eee"}`,background:editing===i?"#fafafa":"white",cursor:"grab"}}
              >
                <span style={{fontSize:13,color:"#bbb",flexShrink:0,cursor:"grab"}}>⠿</span>
                <span style={{width:22,height:22,borderRadius:"50%",background:tbg(t),border:`1.5px solid ${tborder(t)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:t.color,flexShrink:0}}>{t.icon}</span>
                <span style={{flex:1,fontSize:13,color:"#333"}}>{t.label}</span>
                <button onClick={() => { setEditing(i); setDraft({...t}); }} style={{fontSize:12,padding:"2px 8px",borderRadius:6,border:"1px solid #ddd",background:"transparent",color:"#555",cursor:"pointer"}}>Edit</button>
              </div>
            ))}
          </div>
          {editing !== null && (
            <div style={{background:"#f8f8f8",borderRadius:10,padding:12,marginBottom:10,border:"1px solid #e8e8e8"}}>
              <div style={{fontSize:11,color:"#888",marginBottom:8}}>{editing === "new" ? "New type" : "Edit type"}</div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <input value={draft.label ?? ""} onChange={e => setDraft(d => ({...d, label: e.target.value}))} placeholder="Label" style={{flex:1,fontSize:13,padding:"6px 8px",borderRadius:6,border:"1px solid #ddd",outline:"none",color:"#111"}}/>
                <select value={draft.icon ?? "◇"} onChange={e => setDraft(d => ({...d, icon: e.target.value}))} style={{fontSize:14,padding:"6px 8px",borderRadius:6,border:"1px solid #ddd",background:"white",cursor:"pointer",color:"#111"}}>
                  {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <input type="color" value={draft.color ?? "#888780"} onChange={e => setDraft(d => ({...d, color: e.target.value}))} style={{width:34,height:34,borderRadius:6,border:"1px solid #ddd",padding:2,cursor:"pointer"}}/>
              </div>
              <div style={{display:"flex",gap:6,justifyContent:"space-between"}}>
                {editing !== "new" && (
                  <button onClick={() => { persist(localTypes.filter((_, j) => j !== editing)); setEditing(null); }} style={{fontSize:12,padding:"5px 10px",borderRadius:6,border:"1px solid #fcc",background:"#fff5f5",color:"#c00",cursor:"pointer"}}>Delete</button>
                )}
                <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
                  <button onClick={() => setEditing(null)} style={{fontSize:12,padding:"5px 10px",borderRadius:6,border:"1px solid #ddd",background:"transparent",color:"#555",cursor:"pointer"}}>Cancel</button>
                  <button onClick={commit} style={{fontSize:12,padding:"5px 10px",borderRadius:6,border:"none",background:accent,color:"#fff",cursor:"pointer",fontWeight:500}}>Save</button>
                </div>
              </div>
            </div>
          )}
          {editing === null && (
            <button onClick={() => { setEditing("new"); setDraft({label:"",icon:"◇",color:"#888780"}); }} style={{width:"100%",padding:"7px",borderRadius:8,border:"1px dashed #ccc",background:"transparent",color:"#888",fontSize:13,cursor:"pointer"}}>+ Add type</button>
          )}
        </div>

        <div style={{marginTop:24}}>
          <div style={{fontSize:12,fontWeight:500,color:"#555",marginBottom:10}}>Import / Export</div>
          <div style={{display:"flex",gap:4,background:"#f0f0ee",borderRadius:99,padding:3,marginBottom:12}}>
            <button style={tabBtn(ioTab==="export")} onClick={() => setIoTab("export")}>Export</button>
            <button style={tabBtn(ioTab==="import")} onClick={() => setIoTab("import")}>Import</button>
          </div>
          {ioTab === "export"
            ? <button onClick={doExport} style={{width:"100%",padding:"8px",borderRadius:8,border:"none",background:accent,color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer"}}>Download JSON</button>
            : <div>
                <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="Paste exported JSON here…" style={{width:"100%",height:100,fontSize:12,fontFamily:"monospace",borderRadius:8,border:"1px solid #ddd",padding:8,resize:"none",color:"#333",background:"#fafafa",boxSizing:"border-box"}}/>
                {importErr && <div style={{fontSize:12,color:"#c00",marginTop:4}}>{importErr}</div>}
                <button onClick={doImport} style={{marginTop:8,width:"100%",padding:"8px",borderRadius:8,border:"none",background:accent,color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer"}}>Import & Restore</button>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useRef, useEffect } from 'react';
import type { TaskType, AppState, Theme } from '../types';
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
  workdays: number[];
  onWorkdaysChange: (wd: number[]) => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onClose: () => void;
}

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const sectionLabel: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "var(--color-text-tertiary)",
  marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.3px",
};

export function SettingsModal({ accent, onAccentChange, types, onTypesChange, onImport, soundEnabled, onSoundToggle, workdays, onWorkdaysChange, theme, onThemeChange, onClose }: SettingsModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

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
    color: active ? "#fff" : "var(--color-text-tertiary)",
    fontSize: 12, cursor: "pointer", fontWeight: active ? 600 : 400,
    transition: "background 0.15s, color 0.15s",
  });

  const divider: React.CSSProperties = {
    height: "1.5px", background: "var(--color-border-tertiary)", margin: "20px 0",
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)"}}/>
      <div
        style={{position:"relative",zIndex:1,background:"var(--color-background-primary)",borderRadius:16,padding:24,width:"100%",maxWidth:360,boxSizing:"border-box",maxHeight:"85vh",overflowY:"auto",border:"1.5px solid var(--color-border-secondary)",boxShadow:"0 8px 32px rgba(0,0,0,0.18)"}}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:700,color:"var(--color-text-primary)",letterSpacing:"-0.3px"}}>Settings</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--color-text-tertiary)",lineHeight:1,opacity:0.7}}>×</button>
        </div>

        {/* Accent colour */}
        <ColourPicker accent={accent} onChange={onAccentChange}/>

        <div style={divider}/>

        {/* Workdays */}
        <div style={{marginBottom:0}}>
          <div style={sectionLabel}>Workdays</div>
          <div style={{display:"flex",gap:6}}>
            {DAY_LABELS.map((label, i) => {
              const active = workdays.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => {
                    const next = active ? workdays.filter(d => d !== i) : [...workdays, i].sort();
                    onWorkdaysChange(next);
                  }}
                  disabled={active && workdays.length === 1}
                  style={{flex:1,padding:"6px 0",borderRadius:8,border:`1.5px solid ${active ? accent : "var(--color-border-secondary)"}`,background:active ? accent : "transparent",color:active ? "#fff" : "var(--color-text-tertiary)",fontSize:12,fontWeight:active ? 600 : 400,cursor:"pointer",transition:"all 0.15s"}}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={divider}/>

        {/* Sound effects */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{...sectionLabel,marginBottom:0}}>Sound effects</div>
          <button
            onClick={() => onSoundToggle(!soundEnabled)}
            style={{width:40,height:22,borderRadius:99,border:"none",cursor:"pointer",padding:0,background:soundEnabled ? accent : "var(--color-border-secondary)",position:"relative",transition:"background 0.2s"}}
          >
            <span style={{position:"absolute",top:3,left:soundEnabled ? 21 : 3,width:16,height:16,borderRadius:"50%",background:"white",transition:"left 0.2s",display:"block"}}/>
          </button>
        </div>

        <div style={divider}/>

        {/* Appearance */}
        <div>
          <div style={sectionLabel}>Appearance</div>
          <div style={{display:"flex",gap:6}}>
            {(["light", "system", "dark"] as Theme[]).map(t => {
              const active = theme === t;
              const label = t === "light" ? "☀️ Light" : t === "dark" ? "🌙 Dark" : "⚙️ System";
              return (
                <button
                  key={t}
                  onClick={() => onThemeChange(t)}
                  style={{flex:1,padding:"6px 0",borderRadius:8,border:`1.5px solid ${active ? accent : "var(--color-border-secondary)"}`,background:active ? accent : "transparent",color:active ? "#fff" : "var(--color-text-tertiary)",fontSize:12,fontWeight:active ? 600 : 400,cursor:"pointer",transition:"all 0.15s"}}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={divider}/>

        {/* Task types */}
        <div>
          <div style={sectionLabel}>Task types</div>
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
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:10,border:`1.5px solid ${dragOverIdx===i ? accent : "var(--color-border-secondary)"}`,background:editing===i ? "var(--color-background-secondary)" : "var(--color-background-primary)",cursor:"grab",transition:"border-color 0.15s"}}
              >
                <span style={{fontSize:12,color:"var(--color-text-tertiary)",flexShrink:0,cursor:"grab",opacity:0.5}}>⠿</span>
                <span style={{width:22,height:22,borderRadius:"50%",background:tbg(t),border:`1.5px solid ${tborder(t)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:t.color,flexShrink:0}}>{t.icon}</span>
                <span style={{flex:1,fontSize:13,color:"var(--color-text-primary)"}}>{t.label}</span>
                <button onClick={() => { setEditing(i); setDraft({...t}); }} style={{fontSize:12,padding:"3px 10px",borderRadius:99,border:"1.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",cursor:"pointer"}}>Edit</button>
              </div>
            ))}
          </div>
          {editing !== null && (
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:12,marginBottom:10,border:"1.5px solid var(--color-border-secondary)"}}>
              <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.3px"}}>{editing === "new" ? "New type" : "Edit type"}</div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <input value={draft.label ?? ""} onChange={e => setDraft(d => ({...d, label: e.target.value}))} placeholder="Label" style={{flex:1,fontSize:13,padding:"6px 10px",borderRadius:8,border:"1.5px solid var(--color-border-secondary)",outline:"none",color:"var(--color-text-primary)",background:"var(--color-background-primary)",fontFamily:"var(--font-sans)"}}/>
                <select value={draft.icon ?? "◇"} onChange={e => setDraft(d => ({...d, icon: e.target.value}))} style={{fontSize:14,padding:"6px 8px",borderRadius:8,border:"1.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",cursor:"pointer",color:"var(--color-text-primary)"}}>
                  {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <input type="color" value={draft.color ?? "#888780"} onChange={e => setDraft(d => ({...d, color: e.target.value}))} style={{width:34,height:34,borderRadius:8,border:"1.5px solid var(--color-border-secondary)",padding:2,cursor:"pointer"}}/>
              </div>
              <div style={{display:"flex",gap:6,justifyContent:"space-between"}}>
                {editing !== "new" && (
                  <button onClick={() => { persist(localTypes.filter((_, j) => j !== editing)); setEditing(null); }} style={{fontSize:12,padding:"5px 12px",borderRadius:99,border:"1.5px solid #f5c0c0",background:"transparent",color:"#c00",cursor:"pointer"}}>Delete</button>
                )}
                <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
                  <button onClick={() => setEditing(null)} style={{fontSize:12,padding:"5px 12px",borderRadius:99,border:"1.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",cursor:"pointer"}}>Cancel</button>
                  <button onClick={commit} style={{fontSize:12,padding:"5px 12px",borderRadius:99,border:"none",background:accent,color:"#fff",cursor:"pointer",fontWeight:600}}>Save</button>
                </div>
              </div>
            </div>
          )}
          {editing === null && (
            <button onClick={() => { setEditing("new"); setDraft({label:"",icon:"◇",color:"#888780"}); }} style={{width:"100%",padding:"8px",borderRadius:10,border:"1.5px dashed var(--color-border-secondary)",background:"transparent",color:"var(--color-text-tertiary)",fontSize:13,cursor:"pointer"}}>+ Add type</button>
          )}
        </div>

        <div style={divider}/>

        {/* Import / Export */}
        <div>
          <div style={sectionLabel}>Import / Export</div>
          <div style={{display:"flex",gap:4,background:"var(--color-background-secondary)",borderRadius:99,padding:3,marginBottom:12}}>
            <button style={tabBtn(ioTab==="export")} onClick={() => setIoTab("export")}>Export</button>
            <button style={tabBtn(ioTab==="import")} onClick={() => setIoTab("import")}>Import</button>
          </div>
          {ioTab === "export"
            ? <button onClick={doExport} style={{width:"100%",padding:"9px",borderRadius:10,border:"none",background:accent,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Download JSON</button>
            : <div>
                <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="Paste exported JSON here…" style={{width:"100%",height:100,fontSize:12,fontFamily:"monospace",borderRadius:10,border:"1.5px solid var(--color-border-secondary)",padding:8,resize:"none",color:"var(--color-text-primary)",background:"var(--color-background-secondary)",boxSizing:"border-box",outline:"none"}}/>
                {importErr && <div style={{fontSize:12,color:"#c00",marginTop:4}}>{importErr}</div>}
                <button onClick={doImport} style={{marginTop:8,width:"100%",padding:"9px",borderRadius:10,border:"none",background:accent,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Import & Restore</button>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

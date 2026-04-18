"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  DEFAULT_ACCENT, DEFAULT_TYPES, DEFAULT_WORKDAYS, XP_PER_TASK, XP_PER_SUBTASK, COMBO_WINDOW,
  xpForLevel, xpAtLevel, levelFromXp, nextTid, setTid,
} from './lib/constants';
import {
  getDateKey, formatDay, nextWorkday, prevWorkday,
  getDayFlower, getLevelTitle, resolveType, computeStreak,
} from './lib/dateUtils';
import { SFX } from './lib/sfx';
import { loadState, loadSoundEnabled, loadTheme, store } from './lib/storage';
import type { Theme } from './types';
import { FlowerPlant, FLOWER_NAMES } from './components/flowers/FlowerPlant';
import { Particle } from './components/particles/Particle';
import { useParticles } from './components/particles/useParticles';
import { LinkModal } from './components/LinkModal';
import { SettingsModal } from './components/SettingsModal';
import { TaskCard } from './components/TaskCard';
import { TypePicker } from './components/TypePicker';
import { appStyles } from './components/styles';
import type { Task, TasksMap, TaskType, StreakState, AppState } from './types';

export default function App() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [ready, setReady] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(today));
  const [tasks, setTasks] = useState<TasksMap>({});
  const [xp, setXp] = useState(0);
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [types, setTypes] = useState<TaskType[]>(DEFAULT_TYPES);
  const [streak, setStreak] = useState<StreakState>({ count: 0, lastClearedKey: null });
  const [celebrated, setCelebrated] = useState<Record<string, boolean>>({});
  const [prevLevel, setPrevLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [taskInputFocused, setTaskInputFocused] = useState(false);
  const [newTaskType, setNewTaskType] = useState("general");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [newSub, setNewSub] = useState<Record<number, string>>({});
  const [flash, setFlash] = useState<Record<number, boolean>>({});
  const [linkModal, setLinkModal] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [combo, setCombo] = useState(0);
  const [comboToast, setComboToast] = useState<{ mult: number; bonus: number; key: number } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<Theme>("system");
  const [doneCollapsed, setDoneCollapsed] = useState(false);
  const [ooo, setOoo] = useState<Record<string, boolean>>({});
  const [workdays, setWorkdays] = useState<number[]>(DEFAULT_WORKDAYS);
  const comboRef = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { particles, burst, remove } = useParticles();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevAllDone = useRef(false);
  const preCompletionStreak = useRef<StreakState | null>(null);
  const dragId = useRef<number | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const s = loadState();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTasks(s.tasks); setXp(s.xp); setAccent(s.accent); setTypes(s.types);
      setStreak(s.streak); setCelebrated(s.celebrated); setOoo(s.ooo ?? {}); setWorkdays(s.workdays ?? DEFAULT_WORKDAYS);
      const snd = loadSoundEnabled(); setSoundEnabled(snd); SFX.setEnabled(snd);
      setTheme(loadTheme() as Theme);
      let maxId = 0;
      Object.values(s.tasks).forEach(day => (day as Task[]).forEach(task => {
        if (task.id > maxId) maxId = task.id;
        task.subtasks?.forEach(sub => { if (sub.id > maxId) maxId = sub.id; });
      }));
      setTid(maxId + 1);
    } catch { /* ignore parse errors on corrupt storage */ }
    setReady(true);
  }, []);

  const dateKey = getDateKey(currentDate);
  const dayTasks = tasks[dateKey] ?? [];
  const sorted = [...dayTasks].sort((a, b) => (b.important ? 1 : 0) - (a.important ? 1 : 0));
  const activeTasks = sorted.filter(t => !t.done);
  const doneTasks = sorted.filter(t => t.done);
  const done = dayTasks.filter(t => t.done).length;
  const total = dayTasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const level = levelFromXp(xp);
  const lvlXp = xp - xpAtLevel(level);
  const lvlNeeded = xpForLevel(level);
  const lvlPct = Math.round((lvlXp / lvlNeeded) * 100);
  const isToday = getDateKey(currentDate) === getDateKey(today);
  const allDone = total > 0 && done === total;
  const flowerIdx = getDayFlower(dateKey);
  const flowerName = FLOWER_NAMES[flowerIdx];
  const plantDead = total >= 3 && pct < 20 && !isToday;
  const plantStage = plantDead ? 0 : total === 0 ? 0 : Math.min(5, Math.floor((pct / 100) * 5.9));
  const stageNames = ["Seed","Sprout","Budding","Growing","Blooming","In full bloom"];
  const isOOO = !!ooo[dateKey];
  const ab = accent + "18", aborder = accent + "44";

  useEffect(() => {
    const cl = document.documentElement.classList;
    cl.remove("theme-light", "theme-dark");
    if (theme !== "system") cl.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    if (level > prevLevel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowLevelUp(true); SFX.levelUp();
      setTimeout(() => setShowLevelUp(false), 1800);
      setPrevLevel(level);
    }
  }, [level, prevLevel]);

  useEffect(() => {
    if (allDone && !prevAllDone.current && !celebrated[dateKey]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      SFX.dayClear(); setCelebrating(true);
      setTimeout(() => setCelebrating(false), 700);
      const cx = window.innerWidth / 2, cy = window.innerHeight * 0.35;
      const celebColors = [accent, accent + "CC", "#FFD700", "#fff", accent + "88"];
      for (let i = 0; i < 6; i++) setTimeout(() => burst(cx + (Math.random() - 0.5) * 200, cy + (Math.random() - 0.5) * 100, 12, 1.6, celebColors), i * 80);
      const newCel = { ...celebrated, [dateKey]: true };
      setCelebrated(newCel); store.celebrated(newCel);
      if (isToday) {
        preCompletionStreak.current = streak;
        const next = computeStreak(streak, today, ooo, workdays);
        setStreak(next); store.streak(next);
        const MILESTONES = [5, 10, 25, 50, 100];
        if (MILESTONES.includes(next.count)) {
          for (let i = 0; i < 12; i++) setTimeout(() => burst(cx + (Math.random() - 0.5) * 380, cy + (Math.random() - 0.5) * 200, 22, 2, celebColors), 600 + i * 65);
        }
      }
    }
    prevAllDone.current = allDone;
  }, [allDone]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateTasks = (fn: (ts: Task[]) => Task[]) => {
    setTasks(prev => {
      const next: TasksMap = { ...prev, [dateKey]: fn(prev[dateKey] ?? []) };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => store.tasks(next), 600);
      return next;
    });
  };

  const earnXp = useCallback((base: number) => {
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboRef.current += 1;
    const mult = comboRef.current, bonus = Math.round(base * mult);
    setXp(prev => { const next = prev + bonus; store.xp(next); return next; });
    if (mult > 1) { SFX.combo(mult); setComboToast({ mult, bonus, key: Date.now() }); setTimeout(() => setComboToast(null), 1400); }
    comboTimer.current = setTimeout(() => { comboRef.current = 0; setCombo(0); }, COMBO_WINDOW);
    setCombo(mult);
  }, []);

  const loseXp = useCallback((base: number) => {
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboRef.current = 0; setCombo(0);
    setXp(prev => { const next = Math.max(0, prev - base); store.xp(next); return next; });
  }, []);

  const changeAccent = (a: string) => { setAccent(a); store.accent(a); };
  const changeTypes = (tt: TaskType[]) => { setTypes(tt); store.types(tt); };
  const changeSound = (v: boolean) => { setSoundEnabled(v); SFX.setEnabled(v); store.sound(v); };
  const changeTheme = (t: Theme) => { setTheme(t); store.theme(t); };
  const toggleOOO = () => { const next = { ...ooo, [dateKey]: !ooo[dateKey] }; setOoo(next); store.ooo(next); };
  const changeWorkdays = (wd: number[]) => { if (wd.length === 0) return; setWorkdays(wd); store.workdays(wd); };

  const handleImport = useCallback((data: Partial<AppState>) => {
    if (data.tasks)      { setTasks(data.tasks);   store.tasks(data.tasks); }
    if (data.xp != null) { setXp(data.xp);         store.xp(data.xp); }
    if (data.accent)     { setAccent(data.accent);  store.accent(data.accent); }
    if (data.types)      { setTypes(data.types);    store.types(data.types); }
    if (data.streak)     { setStreak(data.streak);  store.streak(data.streak); }
    let maxId = 0;
    Object.values(data.tasks ?? {}).forEach(day => (day as Task[]).forEach(task => {
      if (task.id > maxId) maxId = task.id;
      task.subtasks?.forEach(s => { if (s.id > maxId) maxId = s.id; });
    }));
    setTid(maxId + 1);
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    SFX.addTask();
    if (isToday && celebrated[dateKey] && preCompletionStreak.current) {
      const newCel = { ...celebrated };
      delete newCel[dateKey];
      setCelebrated(newCel); store.celebrated(newCel);
      setStreak(preCompletionStreak.current); store.streak(preCompletionStreak.current);
      preCompletionStreak.current = null;
    }
    updateTasks(ts => [...ts, { id: nextTid(), title: newTask.trim(), type: newTaskType, done: false, important: false, subtasks: [], link: null }]);
    setNewTask("");
  };

  const addSubtask = (taskId: number) => {
    const text = (newSub[taskId] ?? "").trim();
    if (!text) return;
    updateTasks(ts => ts.map(tk => tk.id === taskId ? { ...tk, subtasks: [...tk.subtasks, { id: nextTid(), title: text, done: false }] } : tk));
    setNewSub(s => ({ ...s, [taskId]: "" }));
  };

  const startEdit = (task: Task, e: React.MouseEvent) => { e.stopPropagation(); setEditingId(task.id); setEditText(task.title); };
  const commitEdit = (taskId: number) => { if (editText.trim()) updateTasks(ts => ts.map(tk => tk.id === taskId ? { ...tk, title: editText.trim() } : tk)); setEditingId(null); };

  const toggleTask = (taskId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.ctrlKey || e.metaKey) { const t = dayTasks.find(t => t.id === taskId); if (t?.link) { window.open(t.link.url, "_blank"); return; } }
    const rect = e.currentTarget.getBoundingClientRect();
    const task = dayTasks.find(t => t.id === taskId);
    if (!task) return;
    if (!task.done) {
      SFX.tick(); burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18, 1, [accent, accent + "CC", accent + "88", "#fff", "#FFD700"]); earnXp(XP_PER_TASK);
      setFlash(f => ({ ...f, [taskId]: true })); setTimeout(() => setFlash(f => { const n = { ...f }; delete n[taskId]; return n; }), 400);
    } else { SFX.untick(); loseXp(XP_PER_TASK); }
    updateTasks(ts => ts.map(tk => tk.id !== taskId ? tk : { ...tk, done: !tk.done }));
  };

  const toggleSub = (taskId: number, subId: number, isDone: boolean, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!isDone) { SFX.subtick(); burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 8, 0.7, [accent, accent + "AA", "#fff"]); earnXp(XP_PER_SUBTASK); }
    else { SFX.untick(); loseXp(XP_PER_SUBTASK); }
    updateTasks(ts => ts.map(tk => tk.id !== taskId ? tk : { ...tk, subtasks: tk.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s) }));
  };

  const toggleImportant = (id: number) => {
    const task = dayTasks.find(t => t.id === id);
    if (task && !task.important) SFX.markImportant();
    updateTasks(ts => ts.map(tk => tk.id === id ? { ...tk, important: !tk.important } : tk));
  };
  const delTask = (id: number) => { SFX.removeTask(); updateTasks(ts => ts.filter(tk => tk.id !== id)); };
  const toggleExp = (id: number) => { if (!expanded[id]) SFX.expand(); setExpanded(e => ({ ...e, [id]: !e[id] })); };
  const shiftDay = (dir: number) => { SFX.swoosh(dir); setCurrentDate(dir > 0 ? nextWorkday(currentDate, workdays) : prevWorkday(currentDate, workdays)); };
  const saveLink = (taskId: number, url: string, label: string) => { updateTasks(ts => ts.map(tk => tk.id === taskId ? { ...tk, link: { url, label } } : tk)); setLinkModal(null); };
  const removeLink = (taskId: number) => { updateTasks(ts => ts.map(tk => tk.id === taskId ? { ...tk, link: null } : tk)); setLinkModal(null); };

  const linkModalTask = linkModal != null ? dayTasks.find(t => t.id === linkModal) : null;

  if (!ready) {
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:300,gap:16}}>
        <style>{appStyles}</style>
        <div className="spinner" style={{width:28,height:28,border:`3px solid ${ab}`,borderTopColor:accent,borderRadius:"50%"}}/>
        <div style={{fontSize:13,color:"var(--color-text-tertiary)"}}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={{width:"100%",maxWidth:780,margin:"0 auto",padding:"0 1.25rem 0",fontFamily:"var(--font-sans)",boxSizing:"border-box"}}>
      <style>{appStyles}</style>
      <h2 className="sr-only">Tend</h2>

      {particles.map(p => <Particle key={p.id} x={p.x} y={p.y} color={p.color} size={p.size} onDone={() => remove(p.id)}/>)}

      {showLevelUp && <div className="lvl-toast" style={{position:"fixed",top:64,left:"50%",background:accent,color:"#fff",padding:"10px 22px",borderRadius:99,fontSize:13,fontWeight:700,zIndex:10000,pointerEvents:"none",whiteSpace:"nowrap",letterSpacing:"0.3px"}}>Level up! Now level {level} ✦</div>}
      {comboToast && <div key={comboToast.key} className="combo-toast" style={{position:"fixed",top:108,left:"50%",background:"#222",color:"#FFD700",padding:"8px 18px",borderRadius:99,fontSize:14,fontWeight:700,zIndex:10000,pointerEvents:"none",whiteSpace:"nowrap"}}>{comboToast.mult}× COMBO · +{comboToast.bonus} XP</div>}
      {linkModal != null && <LinkModal accent={accent} existing={linkModalTask?.link ?? null} onSave={(url, label) => saveLink(linkModal, url, label)} onRemove={() => removeLink(linkModal)} onClose={() => setLinkModal(null)}/>}
      {showSettings && <SettingsModal accent={accent} onAccentChange={changeAccent} types={types} onTypesChange={changeTypes} onImport={handleImport} soundEnabled={soundEnabled} onSoundToggle={changeSound} workdays={workdays} onWorkdaysChange={changeWorkdays} theme={theme} onThemeChange={changeTheme} onClose={() => setShowSettings(false)}/>}

      {/* Drag handle strip at the very top */}
      <div style={{height:32,width:"100%",WebkitAppRegion:"drag",cursor:"grab",marginBottom:-32,position:"relative",zIndex:1} as React.CSSProperties}/>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",marginBottom:12,paddingTop:32,WebkitAppRegion:"drag"} as React.CSSProperties}>
        <div style={{fontSize:20,fontWeight:700,color:"var(--color-text-primary)",letterSpacing:"-0.5px",flex:1}}>Tend</div>
        <button onClick={() => setShowSettings(s => !s)} style={{WebkitAppRegion:"no-drag",background:showSettings?ab:"transparent",border:`1.5px solid ${showSettings?aborder:"var(--color-border-tertiary)"}`,borderRadius:10,padding:"5px 8px",cursor:"pointer",fontSize:18,color:showSettings?accent:"var(--color-text-tertiary)",lineHeight:1,transition:"all 0.15s"} as React.CSSProperties}>⚙</button>
      </div>

      {/* Plant + XP ring */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:16,gap:4}}>
        <div style={{position:"relative",width:130,height:130}}>
          <svg width="130" height="130" viewBox="0 0 130 130" style={{position:"absolute",top:0,left:0}}>
            <defs>
              <linearGradient id="xpGrad" gradientUnits="userSpaceOnUse" x1="7" y1="65" x2="123" y2="65">
                <stop offset="0%" stopColor={accent} stopOpacity="0.4"/>
                <stop offset="50%" stopColor={accent} stopOpacity="1"/>
                <stop offset="100%" stopColor={accent} stopOpacity="0.4"/>
                <animateTransform attributeName="gradientTransform" type="rotate"
                  values="0 65 65;180 65 65;0 65 65" dur="3s"
                  calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
                  repeatCount="indefinite"/>
              </linearGradient>
            </defs>
            <circle cx="65" cy="65" r="58" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="5"/>
            <circle cx="65" cy="65" r="58" fill="none" stroke="url(#xpGrad)" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${2*Math.PI*58}`}
              strokeDashoffset={`${2*Math.PI*58*(1 - lvlPct/100)}`}
              style={{transform:"rotate(-90deg)",transformOrigin:"65px 65px",transition:"stroke-dashoffset 0.5s cubic-bezier(.4,0,.2,1)"}}/>
          </svg>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, calc(-50% - 5px))"}}>
            <div className={celebrating ? "plant-celebrate" : plantDead ? "" : "plant-idle"} style={{width:96,height:96,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="96" height="96" viewBox="0 0 100 110"><FlowerPlant index={flowerIdx} stage={plantStage} dead={plantDead}/></svg>
            </div>
          </div>
          <div style={{position:"absolute",bottom:4,right:4,width:24,height:24,borderRadius:"50%",background:accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.18)"}}>{level}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:13,fontWeight:600,color:"var(--color-text-primary)"}}>{getLevelTitle(level)}</span>
          {streak.count > 0 && <>
            <span style={{color:"var(--color-border-secondary)"}}>·</span>
            <span style={{fontSize:13,fontWeight:600,color:"var(--color-text-primary)"}}>🔥 {streak.count}</span>
          </>}
          {combo > 1 && <>
            <span style={{color:"var(--color-border-secondary)"}}>·</span>
            <span key={combo} className="combo-live" style={{fontSize:12,fontWeight:700,color:"#FFD700",background:"#1a1a1a",padding:"1px 8px",borderRadius:99}}>⚡ {combo}×</span>
          </>}
        </div>
        <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>
          {plantDead ? `${flowerName} wilted 🥀` : `${flowerName} · ${stageNames[plantStage]}`}{" · "}{lvlXp}/{lvlNeeded} xp
        </div>
      </div>

      {/* Day nav */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <button onClick={() => shiftDay(-1)} style={{background:"var(--color-background-primary)",border:"1.5px solid var(--color-border-tertiary)",borderRadius:99,cursor:"pointer",fontSize:24,color:"var(--color-text-secondary)",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color 0.15s"}}>‹</button>
        <div style={{textAlign:"center",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <input ref={dateInputRef} type="date"
            value={`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,"0")}-${String(currentDate.getDate()).padStart(2,"0")}`}
            onChange={e => { const [y,m,d] = e.target.value.split("-").map(Number); if (y && m && d) setCurrentDate(new Date(y, m-1, d)); }}
            style={{position:"absolute",opacity:0,pointerEvents:"none",width:0,height:0}}/>
          <button onClick={() => dateInputRef.current?.showPicker()} style={{fontSize:17,fontWeight:700,color:"var(--color-text-primary)",letterSpacing:"-0.2px",background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"var(--font-sans)"}}>{formatDay(currentDate, workdays)}</button>
          {total > 0 && <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{done} of {total} done</div>}
          {!isToday && <button onClick={() => setCurrentDate(new Date(today))} style={{fontSize:11,color:"var(--color-text-secondary)",background:"var(--color-background-secondary)",border:"1.5px solid var(--color-border-secondary)",borderRadius:99,cursor:"pointer",padding:"2px 10px",fontFamily:"var(--font-sans)"}}>↩ today</button>}
          {(total === 0 || isOOO) && <button onClick={toggleOOO} style={{fontSize:11,padding:"2px 10px",borderRadius:99,border:`1.5px solid ${isOOO?"#F0A500":"var(--color-border-tertiary)"}`,background:isOOO?"#FFF7E0":"transparent",color:isOOO?"#B07500":"var(--color-text-tertiary)",cursor:"pointer",fontWeight:isOOO?600:400,transition:"all 0.15s"}}>
            {isOOO ? "🏖 Out of office" : "Out of office"}
          </button>}
        </div>
        <button onClick={() => shiftDay(1)} style={{background:"var(--color-background-primary)",border:"1.5px solid var(--color-border-tertiary)",borderRadius:99,cursor:"pointer",fontSize:24,color:"var(--color-text-secondary)",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color 0.15s"}}>›</button>
      </div>

      {total > 0 && <div style={{height:7,background:"var(--color-border-tertiary)",borderRadius:99,marginBottom:12,overflow:"hidden"}}><div className="day-bar-fill" style={{height:"100%",width:`${pct}%`,background:allDone?"#1D9E75":accent,borderRadius:99,position:"relative",overflow:"hidden"}}><div className="bar-sweep"/></div></div>}

      {allDone && (
        <div className="banner-in" style={{background:"linear-gradient(135deg,#EBF5DB,#D5EDD5)",border:"1.5px solid #B8D98A",borderRadius:12,padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>🌸</span>
          <div>
            <div style={{fontSize:13,color:"#1E5C1E",fontWeight:700}}>All done!</div>
            <div style={{fontSize:11,color:"#4A7A4A"}}>{streak.count > 1 ? `${streak.count} day streak 🔥` : "Streak started!"}</div>
          </div>
        </div>
      )}

      {/* Tasks */}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20,minWidth:0}}>
        {sorted.length === 0 && (
          <div style={{textAlign:"center",padding:"3rem 0 2rem"}}>
            <div style={{fontSize:36,marginBottom:10}}>{isOOO ? "🏖" : "🌱"}</div>
            <div style={{color:"var(--color-text-tertiary)",fontSize:14,lineHeight:1.5}}>
              {isOOO ? <>Out of office — enjoy your day!<br/>Your streak is safe.</> : <>Nothing here yet.<br/>Add a task to get growing.</>}
            </div>
          </div>
        )}
        {activeTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            types={types}
            accent={accent}
            isExpanded={!!expanded[task.id]}
            isFlash={!!flash[task.id]}
            isEditing={editingId === task.id}
            editText={editText}
            newSubText={newSub[task.id] ?? ""}
            isDragOver={dragOverId === task.id}
            onToggle={e => toggleTask(task.id, e)}
            onToggleSub={(subId, isDone, e) => toggleSub(task.id, subId, isDone, e)}
            onToggleImportant={() => toggleImportant(task.id)}
            onDelete={() => delTask(task.id)}
            onToggleExpand={() => toggleExp(task.id)}
            onStartEdit={e => startEdit(task, e)}
            onCommitEdit={() => commitEdit(task.id)}
            onCancelEdit={() => setEditingId(null)}
            onEditTextChange={setEditText}
            onSubTextChange={text => setNewSub(s => ({ ...s, [task.id]: text }))}
            onAddSubtask={() => addSubtask(task.id)}
            onTypeChange={v => updateTasks(ts => ts.map(tk => tk.id === task.id ? { ...tk, type: v } : tk))}
            onDeleteSub={subId => updateTasks(ts => ts.map(tk => tk.id === task.id ? { ...tk, subtasks: tk.subtasks.filter(s => s.id !== subId) } : tk))}
            onOpenLinkModal={() => setLinkModal(task.id)}
            onDragStart={() => { dragId.current = task.id; }}
            onDragOver={e => { e.preventDefault(); setDragOverId(task.id); }}
            onDrop={e => {
              e.preventDefault();
              if (dragId.current === task.id) { dragId.current = null; setDragOverId(null); return; }
              updateTasks(ts => {
                const arr = [...ts];
                const fi = arr.findIndex(t => t.id === dragId.current), ti = arr.findIndex(t => t.id === task.id);
                const [item] = arr.splice(fi, 1); arr.splice(ti, 0, item);
                return arr;
              });
              dragId.current = null; setDragOverId(null);
            }}
            onDragEnd={() => { dragId.current = null; setDragOverId(null); }}
          />
        ))}
        {doneTasks.length > 0 && (
          <>
            <div
              className="done-section-header"
              onClick={() => setDoneCollapsed(c => !c)}
              style={{marginTop:activeTasks.length > 0 ? 4 : 0}}
            >
              <div style={{flex:1,height:"1px",background:"var(--color-border-tertiary)"}}/>
              <span style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:600,letterSpacing:"0.3px",whiteSpace:"nowrap"}}>Completed ({doneTasks.length})</span>
              <span className="done-toggle" style={{fontSize:10,color:"var(--color-text-tertiary)",opacity:0.5,transition:"opacity 0.15s"}}>{doneCollapsed ? "▶" : "▼"}</span>
              <div style={{flex:1,height:"1px",background:"var(--color-border-tertiary)"}}/>
            </div>
            {!doneCollapsed && doneTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                types={types}
                accent={accent}
                isExpanded={!!expanded[task.id]}
                isFlash={!!flash[task.id]}
                isEditing={editingId === task.id}
                editText={editText}
                newSubText={newSub[task.id] ?? ""}
                isDragOver={dragOverId === task.id}
                onToggle={e => toggleTask(task.id, e)}
                onToggleSub={(subId, isDone, e) => toggleSub(task.id, subId, isDone, e)}
                onToggleImportant={() => toggleImportant(task.id)}
                onDelete={() => delTask(task.id)}
                onToggleExpand={() => toggleExp(task.id)}
                onStartEdit={e => startEdit(task, e)}
                onCommitEdit={() => commitEdit(task.id)}
                onCancelEdit={() => setEditingId(null)}
                onEditTextChange={setEditText}
                onSubTextChange={text => setNewSub(s => ({ ...s, [task.id]: text }))}
                onAddSubtask={() => addSubtask(task.id)}
                onTypeChange={v => updateTasks(ts => ts.map(tk => tk.id === task.id ? { ...tk, type: v } : tk))}
                onDeleteSub={subId => updateTasks(ts => ts.map(tk => tk.id === task.id ? { ...tk, subtasks: tk.subtasks.filter(s => s.id !== subId) } : tk))}
                onOpenLinkModal={() => setLinkModal(task.id)}
                onDragStart={() => { dragId.current = task.id; }}
                onDragOver={e => { e.preventDefault(); setDragOverId(task.id); }}
                onDrop={e => {
                  e.preventDefault();
                  if (dragId.current === task.id) { dragId.current = null; setDragOverId(null); return; }
                  updateTasks(ts => {
                    const arr = [...ts];
                    const fi = arr.findIndex(t => t.id === dragId.current), ti = arr.findIndex(t => t.id === task.id);
                    const [item] = arr.splice(fi, 1); arr.splice(ti, 0, item);
                    return arr;
                  });
                  dragId.current = null; setDragOverId(null);
                }}
                onDragEnd={() => { dragId.current = null; setDragOverId(null); }}
              />
            ))}
          </>
        )}
      </div>

      {/* Spacer so content isn't hidden behind the fixed footer */}
      <div style={{height: isOOO ? 0 : 84}}/>

      {/* Add task — fixed footer */}
      {!isOOO && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"var(--color-background-primary)",borderTop:"1.5px solid var(--color-border-tertiary)"}}>
          <div style={{maxWidth:780,margin:"0 auto",padding:"12px 1.25rem"}}>
            <div style={{display:"flex",borderRadius:12,border:taskInputFocused?`1.5px solid ${accent}`:"1.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",transition:"border-color 0.15s",overflow:"hidden"}}>
              <div style={{borderRight:"1.5px solid var(--color-border-secondary)",display:"flex",alignItems:"center",flexShrink:0}}>
                <TypePicker value={newTaskType} onChange={setNewTaskType} types={types}/>
              </div>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} onFocus={() => setTaskInputFocused(true)} onBlur={() => setTaskInputFocused(false)} placeholder={`Add ${resolveType(types, newTaskType).label.toLowerCase()} task...`} style={{flex:1,fontSize:14,padding:"10px 14px",border:"none",outline:"none",background:"transparent",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)"}}/>
              <button onClick={addTask} onMouseDown={e => (e.currentTarget.style.transform = "scale(0.93)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")} style={{padding:"10px 16px",border:"none",background:accent,cursor:"pointer",fontSize:20,color:"#fff",fontWeight:700,flexShrink:0,transition:"box-shadow 0.2s",boxShadow:newTask.trim()?`0 0 0 3px ${accent}55`:"none"}}>+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

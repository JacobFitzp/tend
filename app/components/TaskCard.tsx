"use client";
import type { Task, TaskType } from '../types';
import { tbg, tborder } from '../lib/constants';
import { TypePicker } from './TypePicker';

interface TaskCardProps {
  task: Task;
  types: TaskType[];
  accent: string;
  isExpanded: boolean;
  isFlash: boolean;
  isEditing: boolean;
  editText: string;
  newSubText: string;
  isDragOver: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onToggleSub: (subId: number, isDone: boolean, e: React.MouseEvent<HTMLButtonElement>) => void;
  onToggleImportant: () => void;
  onDelete: () => void;
  onToggleExpand: () => void;
  onStartEdit: (e: React.MouseEvent<HTMLSpanElement>) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onSubTextChange: (text: string) => void;
  onAddSubtask: () => void;
  onTypeChange: (typeId: string) => void;
  onDeleteSub: (subId: number) => void;
  onOpenLinkModal: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

export function TaskCard({
  task, types, accent, isExpanded, isFlash, isEditing, editText, newSubText, isDragOver,
  onToggle, onToggleSub, onToggleImportant, onDelete, onToggleExpand,
  onStartEdit, onCommitEdit, onCancelEdit, onEditTextChange, onSubTextChange, onAddSubtask,
  onTypeChange, onDeleteSub, onOpenLinkModal, onDragStart, onDragOver, onDrop, onDragEnd,
}: TaskCardProps) {
  const tp = types.find(t => t.id === task.type) ?? types[0];
  const subDone = task.subtasks.filter(s => s.done).length;
  const subTotal = task.subtasks.length;
  const subPct = subTotal ? Math.round((subDone / subTotal) * 100) : 0;
  const isImp = task.important;
  const hasLink = !!task.link;

  return (
    <div
      className={`task-card${isImp ? " imp-card" : ""}${isDragOver ? " drag-over" : ""}`}
      draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onDragEnd={onDragEnd}
      style={{
        background: isImp ? "linear-gradient(135deg,#FDF3E0 0%,var(--color-background-primary) 55%)" : "var(--color-background-primary)",
        border: isImp ? "1.5px solid #F0B85A" : "1.5px solid var(--color-border-secondary)",
        borderRadius: 16, overflow: "visible", opacity: task.done ? 0.5 : 1,
        borderLeft: `4px solid ${task.done ? "#1D9E75" : isImp ? "#EF9F27" : tp.color}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        cursor: "grab", width: "100%", minWidth: 0, boxSizing: "border-box",
      }}
    >
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"11px 12px 11px 12px",borderTopLeftRadius:14,borderTopRightRadius:14,overflow:"hidden"}}>
        <span style={{color:"var(--color-text-tertiary)",fontSize:11,cursor:"grab",userSelect:"none",flexShrink:0,opacity:0.5}}>⠿</span>
        <button
          onClick={onToggle}
          className={`check-btn${isFlash ? " pop" : ""}`}
          title={hasLink ? "Ctrl+click to open link" : ""}
          style={{width:22,height:22,borderRadius:"50%",flexShrink:0,border:task.done?"none":`2px solid ${isImp?"#EF9F27":tp.color}`,background:task.done?"#1D9E75":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
        >
          {task.done && <span style={{color:"#fff",fontSize:10,fontWeight:700}}>✓</span>}
        </button>
        {isEditing ? (
          <input
            value={editText}
            onChange={e => onEditTextChange(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") onCommitEdit(); if (e.key === "Escape") onCancelEdit(); }}
            onBlur={onCommitEdit}
            autoFocus
            style={{flex:1,fontSize:14,padding:"2px 8px",borderRadius:8,border:`1.5px solid ${accent}`,outline:"none",color:"var(--color-text-primary)",background:"var(--color-background-secondary)",fontFamily:"var(--font-sans)"}}
          />
        ) : (
          <span
            onClick={onStartEdit}
            style={{flex:1,fontSize:14,color:"var(--color-text-primary)",textDecoration:task.done?"line-through":"none",fontWeight:isImp?600:400,cursor:"text",lineHeight:1.4}}
          >{task.title}</span>
        )}
        {subTotal > 0 && <span onClick={e => { e.stopPropagation(); onToggleExpand(); }} title="Show subtasks" style={{fontSize:11,padding:"2px 7px",borderRadius:99,background:"var(--color-background-secondary)",color:"var(--color-text-secondary)",fontWeight:600,flexShrink:0,cursor:"pointer"}}>{subDone}/{subTotal}</span>}
        <span title={tp.label} style={{width:20,height:20,borderRadius:"50%",background:tbg(tp),border:`1.5px solid ${tborder(tp)}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,color:tp.color}}>{tp.icon}</span>
        {hasLink && (
          <span
            title={`Link: ${task.link!.label}`}
            onClick={e => { e.stopPropagation(); window.open(task.link!.url, "_blank"); }}
            style={{width:20,height:20,borderRadius:"50%",background:"#E6F1FB",border:"1.5px solid #B5D4F4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,cursor:"pointer"}}
          >🔗</span>
        )}
        <button onClick={onToggleImportant} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,opacity:isImp?1:0.18,color:"#EF9F27",padding:"0 1px",lineHeight:1,flexShrink:0}}>★</button>
        <button onClick={onToggleExpand} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:10,padding:"2px 3px",lineHeight:1,flexShrink:0,opacity:0.7}}>{isExpanded ? "▲" : "▼"}</button>
        <button onClick={onDelete} className="delete-btn" style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:16,padding:"1px 2px",lineHeight:1,flexShrink:0}}>×</button>
      </div>

      {subTotal > 0 && !isExpanded && (
        <div style={{height:3,background:"var(--color-border-tertiary)",margin:"0 16px 10px"}}>
          <div style={{height:"100%",width:`${subPct}%`,background:isImp?"#EF9F27":tp.color,borderRadius:99,transition:"width 0.4s"}}/>
        </div>
      )}

      {isExpanded && (
        <div style={{borderTop:"1.5px solid var(--color-border-tertiary)",padding:"12px",background:"var(--color-background-primary)",borderBottomLeftRadius:16,borderBottomRightRadius:16}}>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:6,fontWeight:600,letterSpacing:"0.3px",textTransform:"uppercase"}}>Type</div>
            <div style={{display:"inline-flex"}}><TypePicker value={task.type} onChange={onTypeChange} types={types}/></div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:6,fontWeight:600,letterSpacing:"0.3px",textTransform:"uppercase"}}>Link</div>
            {task.link ? (
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <a href={task.link.url} target="_blank" rel="noreferrer" style={{fontSize:13,color:accent,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>🔗 {task.link.label}</a>
                <button onClick={onOpenLinkModal} style={{fontSize:12,padding:"3px 10px",borderRadius:99,border:"1.5px solid var(--color-border-secondary)",background:"transparent",color:"var(--color-text-secondary)",cursor:"pointer"}}>Edit</button>
              </div>
            ) : (
              <button onClick={onOpenLinkModal} style={{fontSize:12,padding:"5px 12px",borderRadius:99,border:"1.5px dashed var(--color-border-secondary)",background:"transparent",color:"var(--color-text-tertiary)",cursor:"pointer"}}>+ Attach link</button>
            )}
          </div>
          {task.subtasks.map(s => (
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <button
                onClick={e => onToggleSub(s.id, s.done, e)}
                style={{width:16,height:16,borderRadius:5,flexShrink:0,border:s.done?"none":`1.5px solid ${tp.color}`,background:s.done?"#1D9E75":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
              >
                {s.done && <span style={{color:"#fff",fontSize:9,fontWeight:700}}>✓</span>}
              </button>
              <span style={{fontSize:13,color:"var(--color-text-secondary)",textDecoration:s.done?"line-through":"none",flex:1}}>{s.title}</span>
              <button onClick={() => onDeleteSub(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)",fontSize:14,padding:"0 2px",lineHeight:1,opacity:0.45}}>×</button>
            </div>
          ))}
          <div style={{display:"flex",gap:6,marginTop:10}}>
            <input
              value={newSubText}
              onChange={e => onSubTextChange(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onAddSubtask()}
              placeholder="Add subtask..."
              style={{flex:1,fontSize:13,padding:"7px 10px",borderRadius:10,border:"1.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",outline:"none",fontFamily:"var(--font-sans)"}}
            />
            <button onClick={onAddSubtask} style={{fontSize:14,padding:"7px 12px",borderRadius:10,border:`1.5px solid ${tp.color}`,background:"transparent",cursor:"pointer",color:tp.color,fontWeight:600}}>+</button>
          </div>
        </div>
      )}
    </div>
  );
}

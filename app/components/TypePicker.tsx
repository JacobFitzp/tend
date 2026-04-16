"use client";
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TaskType } from '../types';

interface TypePickerProps {
  value: string;
  onChange: (id: string) => void;
  types: TaskType[];
}

export function TypePicker({ value, onChange, types }: TypePickerProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{top:number;left:number}>({top:0,left:0});
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = types.find(t => t.id === value) ?? types[0];

  const openMenu = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.top - 6, left: r.left });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <div style={{position:"relative",flexShrink:0}}>
      <button
        ref={btnRef}
        onClick={openMenu}
        title={selected.label}
        style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",minWidth:38,padding:"0 12px",border:"none",background:"transparent",cursor:"pointer",fontSize:16,lineHeight:1}}
      >
        <span style={{color:selected.color}}>{selected.icon}</span>
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          style={{position:"fixed",top:menuPos.top,left:menuPos.left,transform:"translateY(-100%)",background:"var(--color-background-primary)",borderRadius:10,border:"1.5px solid var(--color-border-secondary)",boxShadow:"0 4px 18px rgba(0,0,0,0.15)",zIndex:99999,minWidth:150,overflow:"hidden"}}
        >
          {types.map(t => (
            <button
              key={t.id}
              onClick={() => { onChange(t.id); setOpen(false); }}
              style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 12px",border:"none",background:value===t.id?"var(--color-background-secondary)":"transparent",cursor:"pointer",fontFamily:"var(--font-sans)",textAlign:"left"}}
            >
              <span style={{fontSize:14,color:t.color,flexShrink:0}}>{t.icon}</span>
              <span style={{fontSize:13,color:"var(--color-text-primary)",fontWeight:value===t.id?600:400}}>{t.label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

'use client';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { X, Check, AlertTriangle, Search } from 'lucide-react';

/* ---------------- Toasts ---------------- */
type Toast = { id: number; msg: string; kind: 'ok' | 'err' };
const ToastCtx = createContext<(msg: string, kind?: 'ok' | 'err') => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, kind: 'ok' | 'err' = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="a-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`a-toast ${t.kind}`}>
            {t.kind === 'ok' ? <Check size={16} color="var(--teal)" /> : <AlertTriangle size={16} color="#ff9d9d" />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------------- Modal ---------------- */
export function Modal({ title, onClose, children, footer, wide }: {
  title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean;
}) {
  return (
    <div className="a-overlay" onClick={onClose}>
      <div className="a-modal" style={wide ? { maxWidth: 720 } : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="a-modal-head">
          <h3 style={{ fontSize: '1.15rem' }}>{title}</h3>
          <button className="a-iconbtn" onClick={onClose} aria-label="Cerrar"><X size={16} /></button>
        </div>
        <div className="a-modal-body">{children}</div>
        {footer && <div className="a-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------------- Confirm ---------------- */
export function Confirm({ title, message, confirmLabel = 'Eliminar', onCancel, onConfirm, danger = true }: {
  title: string; message: string; confirmLabel?: string; onCancel: () => void; onConfirm: () => void; danger?: boolean;
}) {
  return (
    <Modal title={title} onClose={onCancel}
      footer={<>
        <button className="a-btn" onClick={onCancel}>Cancelar</button>
        <button className={`a-btn ${danger ? 'danger' : 'primary'}`} onClick={onConfirm}>{confirmLabel}</button>
      </>}>
      <p style={{ color: 'var(--ink-soft)' }}>{message}</p>
    </Modal>
  );
}

/* ---------------- Campos de formulario ---------------- */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="a-field"><label className="a-label">{label}</label>{children}</div>;
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="a-input" {...props} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="a-textarea" {...props} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="a-select" {...props} />;
}
export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button type="button" className={`a-toggle ${on ? 'on' : ''}`} onClick={onClick} role="switch" aria-checked={on} />;
}
export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="a-search">
      <Search size={15} />
      <input className="a-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || 'Buscar…'} />
    </div>
  );
}

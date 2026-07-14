'use client';
import { useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { auth } from '@/lib/auth';
import { Field, Input, useToast } from '@/components/admin/ui';

export default function CuentaAdmin() {
  const toast = useToast();
  const user = auth.user();
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [repetir, setRepetir] = useState('');
  const [saving, setSaving] = useState(false);

  async function cambiar(e: React.FormEvent) {
    e.preventDefault();
    if (nueva !== repetir) { toast('Las contraseñas no coinciden.', 'err'); return; }
    setSaving(true);
    try {
      await adminApi.changePassword(actual, nueva);
      toast('Contraseña actualizada.');
      setActual(''); setNueva(''); setRepetir('');
    } catch (e: any) { toast(e.message, 'err'); }
    setSaving(false);
  }

  return (
    <>
      <div className="a-pagehead"><div><h1>Mi cuenta</h1><p>Datos de tu sesión y seguridad.</p></div></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        <div className="a-panel">
          <div className="a-panel-head"><strong>Perfil</strong></div>
          <div style={{ padding: 20, display: 'grid', gap: 12, fontSize: 14 }}>
            <div><span className="a-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>Nombre</span><div>{user?.nombre}</div></div>
            <div><span className="a-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>Correo</span><div>{user?.email}</div></div>
            <div><span className="a-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>Rol</span><div><span className="a-badge">{user?.rol}</span></div></div>
          </div>
        </div>

        <div className="a-panel">
          <div className="a-panel-head"><strong>Cambiar contraseña</strong></div>
          <form onSubmit={cambiar} style={{ padding: 20 }}>
            <Field label="Contraseña actual"><Input type="password" required value={actual} onChange={(e) => setActual(e.target.value)} /></Field>
            <Field label="Nueva contraseña (mín. 8)"><Input type="password" required minLength={8} value={nueva} onChange={(e) => setNueva(e.target.value)} /></Field>
            <Field label="Repetir nueva contraseña"><Input type="password" required value={repetir} onChange={(e) => setRepetir(e.target.value)} /></Field>
            <button className="a-btn primary" disabled={saving}>{saving ? 'Guardando…' : 'Actualizar contraseña'}</button>
          </form>
        </div>
      </div>
    </>
  );
}

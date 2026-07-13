'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { AREAS } from '@/lib/areas';

const initial = { nombre: '', empresa: '', email: '', telefono: '', ciudad: '', area: '', mensaje: '' };

export function QuoteForm({ servicioPreseleccionado }: { servicioPreseleccionado?: string }) {
  const [form, setForm] = useState({
    ...initial,
    mensaje: servicioPreseleccionado ? `Me interesa el servicio: ${servicioPreseleccionado}. ` : '',
  });
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEstado('enviando'); setError('');
    try {
      await api.crearLead({
        nombre: form.nombre,
        empresa: form.empresa || undefined,
        email: form.email,
        telefono: form.telefono || undefined,
        ciudad: form.ciudad || undefined,
        area: form.area || undefined,
        mensaje: form.mensaje,
        origen: 'web-contacto',
      });
      setEstado('ok');
    } catch (err) {
      setEstado('error');
      setError(err instanceof Error ? err.message : 'No se pudo enviar.');
    }
  }

  if (estado === 'ok') {
    return (
      <div className="card" style={{ borderColor: 'var(--teal)' }}>
        <p className="eyebrow" style={{ color: 'var(--teal)' }}>Solicitud recibida</p>
        <h3 style={{ marginTop: 12 }}>Gracias, {form.nombre.split(' ')[0]}.</h3>
        <p style={{ color: 'var(--ink-soft)', marginTop: 10 }}>
          Registramos tu solicitud. Un especialista de Dynamics DMG 360 se pondrá en contacto contigo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="card">
      <div className="grid grid-2" style={{ gap: 0, columnGap: 18 }}>
        <div className="field">
          <label htmlFor="nombre">Nombre completo *</label>
          <input id="nombre" required value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="empresa">Empresa</label>
          <input id="empresa" value={form.empresa} onChange={(e) => set('empresa', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">Correo *</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="telefono">Teléfono</label>
          <input id="telefono" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="ciudad">Ciudad</label>
          <input id="ciudad" value={form.ciudad} onChange={(e) => set('ciudad', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="area">Área de interés</label>
          <select id="area" value={form.area} onChange={(e) => set('area', e.target.value)}>
            <option value="">Selecciona…</option>
            {Object.entries(AREAS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="mensaje">Describe tu requerimiento *</label>
        <textarea id="mensaje" required minLength={10} value={form.mensaje} onChange={(e) => set('mensaje', e.target.value)} />
      </div>
      {estado === 'error' && (
        <p style={{ color: '#ff8f8f', fontSize: 14, marginBottom: 12 }}>{error}</p>
      )}
      <button className="btn btn-primary" type="submit" disabled={estado === 'enviando'}>
        {estado === 'enviando' ? 'Enviando…' : 'Enviar solicitud'}
      </button>
      <p style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 14 }}>
        Usaremos tus datos únicamente para responder tu solicitud comercial.
      </p>
    </form>
  );
}

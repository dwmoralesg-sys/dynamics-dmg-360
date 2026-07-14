'use client';
import { useEffect, useMemo, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { Modal, Field, Input, Textarea, Select, useToast } from '@/components/admin/ui';

export default function ContenidoAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState('');
  const [nuevo, setNuevo] = useState(false);
  const [nForm, setNForm] = useState({ clave: '', grupo: 'home', tipo: 'TEXTO', valor: '', descripcion: '' });

  async function cargar() {
    setLoading(true);
    try {
      const data = await adminApi.contenido.list();
      setItems(data);
      setDraft(Object.fromEntries(data.map((b: any) => [b.clave, b.valor])));
    } catch (e: any) { toast(e.message, 'err'); }
    setLoading(false);
  }
  useEffect(() => { cargar(); }, []);

  const grupos = useMemo(() => {
    const g: Record<string, any[]> = {};
    for (const b of items) (g[b.grupo] ||= []).push(b);
    return g;
  }, [items]);

  async function guardar(b: any) {
    setSavingKey(b.clave);
    try {
      await adminApi.contenido.upsert({ clave: b.clave, grupo: b.grupo, tipo: b.tipo, valor: draft[b.clave], descripcion: b.descripcion });
      toast('Contenido guardado.');
    } catch (e: any) { toast(e.message, 'err'); }
    setSavingKey('');
  }

  async function crear() {
    try {
      await adminApi.contenido.upsert(nForm);
      toast('Bloque creado.'); setNuevo(false);
      setNForm({ clave: '', grupo: 'home', tipo: 'TEXTO', valor: '', descripcion: '' }); cargar();
    } catch (e: any) { toast(e.message, 'err'); }
  }

  const grupoLabel: Record<string, string> = { home: 'Inicio', nosotros: 'Nosotros', contacto: 'Contacto', footer: 'Pie de página' };

  return (
    <>
      <div className="a-pagehead">
        <div><h1>Textos e imágenes</h1><p>Edita el contenido de la web sin tocar código. Los cambios se reflejan en el sitio público.</p></div>
        <button className="a-btn primary" onClick={() => setNuevo(true)}><Plus size={15} /> Nuevo bloque</button>
      </div>

      {loading && <p className="a-muted">Cargando…</p>}
      {!loading && items.length === 0 && <div className="a-panel"><div className="a-empty">Aún no hay contenido. Ejecuta el seed del backend o crea un bloque nuevo.</div></div>}

      {Object.entries(grupos).map(([grupo, bloques]) => (
        <div key={grupo} className="a-panel" style={{ marginBottom: 20 }}>
          <div className="a-panel-head"><strong>{grupoLabel[grupo] || grupo}</strong><span className="a-muted" style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{grupo}</span></div>
          <div style={{ padding: 20 }}>
            {bloques.map((b) => (
              <div key={b.clave} style={{ marginBottom: 20 }}>
                <label className="a-label">{b.descripcion || b.clave}</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  {b.valor.length > 60 || b.tipo === 'HTML'
                    ? <textarea className="a-textarea" value={draft[b.clave] ?? ''} onChange={(e) => setDraft({ ...draft, [b.clave]: e.target.value })} />
                    : <input className="a-input" value={draft[b.clave] ?? ''} onChange={(e) => setDraft({ ...draft, [b.clave]: e.target.value })} />}
                  <button className="a-btn primary" onClick={() => guardar(b)} disabled={savingKey === b.clave || draft[b.clave] === b.valor}>
                    <Save size={14} /> {savingKey === b.clave ? '…' : 'Guardar'}
                  </button>
                </div>
                <div className="a-muted" style={{ fontSize: 11, fontFamily: 'var(--font-mono)', marginTop: 4 }}>{b.clave}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {nuevo && (
        <Modal title="Nuevo bloque de contenido" onClose={() => setNuevo(false)}
          footer={<>
            <button className="a-btn" onClick={() => setNuevo(false)}>Cancelar</button>
            <button className="a-btn primary" onClick={crear} disabled={!nForm.clave || !nForm.valor}>Crear</button>
          </>}>
          <Field label="Clave única (ej. home.hero.titulo)"><Input value={nForm.clave} onChange={(e) => setNForm({ ...nForm, clave: e.target.value })} /></Field>
          <div className="a-grid2">
            <Field label="Grupo"><Input value={nForm.grupo} onChange={(e) => setNForm({ ...nForm, grupo: e.target.value })} placeholder="home, contacto…" /></Field>
            <Field label="Tipo"><Select value={nForm.tipo} onChange={(e) => setNForm({ ...nForm, tipo: e.target.value })}>{['TEXTO', 'HTML', 'IMAGEN', 'JSON'].map((t) => <option key={t} value={t}>{t}</option>)}</Select></Field>
          </div>
          <Field label="Valor"><Textarea value={nForm.valor} onChange={(e) => setNForm({ ...nForm, valor: e.target.value })} /></Field>
          <Field label="Descripción (ayuda)"><Input value={nForm.descripcion} onChange={(e) => setNForm({ ...nForm, descripcion: e.target.value })} /></Field>
        </Modal>
      )}
    </>
  );
}

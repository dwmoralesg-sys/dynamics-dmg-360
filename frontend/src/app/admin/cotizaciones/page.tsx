'use client';
import { useEffect, useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { ESTADO_COTIZACION, badgeClass, labelEstado } from '@/lib/adminConst';
import { Modal, Field, Input, Textarea, Select, SearchBox, useToast } from '@/components/admin/ui';

export default function CotizacionesAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState('');
  const [ver, setVer] = useState<any | null>(null);
  const [form, setForm] = useState<any>({ estado: '', montoEstimado: '', notas: '' });
  const [saving, setSaving] = useState(false);

  async function cargar() {
    setLoading(true);
    try { setItems(await adminApi.cotizaciones.list(filtro || undefined)); } catch (e: any) { toast(e.message, 'err'); }
    setLoading(false);
  }
  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [filtro]);

  const filtrados = useMemo(() => items.filter((c) =>
    c.codigo.toLowerCase().includes(q.toLowerCase()) ||
    (c.lead?.nombre || '').toLowerCase().includes(q.toLowerCase())
  ), [items, q]);

  async function abrir(c: any) {
    try {
      const full = await adminApi.cotizaciones.get(c.id);
      setVer(full);
      setForm({ estado: full.estado, montoEstimado: full.montoEstimado ?? '', notas: full.notas ?? '' });
    } catch (e: any) { toast(e.message, 'err'); }
  }

  async function guardar() {
    if (!ver) return;
    setSaving(true);
    try {
      await adminApi.cotizaciones.update(ver.id, {
        estado: form.estado,
        montoEstimado: form.montoEstimado === '' ? undefined : Number(form.montoEstimado),
        notas: form.notas || undefined,
      });
      toast('Cotización actualizada.'); setVer(null); cargar();
    } catch (e: any) { toast(e.message, 'err'); }
    setSaving(false);
  }

  return (
    <>
      <div className="a-pagehead">
        <div><h1>Cotizaciones</h1><p>Solicitudes de presupuesto y su seguimiento comercial.</p></div>
      </div>

      <div className="a-panel">
        <div className="a-panel-head">
          <div className="a-filters">
            <div style={{ width: 240 }}><SearchBox value={q} onChange={setQ} placeholder="Buscar código o cliente…" /></div>
            <select className="a-select" style={{ width: 190 }} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="">Todos los estados</option>
              {ESTADO_COTIZACION.map((e) => <option key={e} value={e}>{labelEstado(e)}</option>)}
            </select>
          </div>
        </div>
        <table className="a-table">
          <thead><tr><th>Código</th><th>Cliente</th><th>Monto</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="a-empty">Cargando…</td></tr>}
            {!loading && filtrados.map((c) => (
              <tr key={c.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{c.codigo}</td>
                <td>{c.lead?.nombre || '—'}<div className="a-muted" style={{ fontSize: 12 }}>{c.lead?.empresa || ''}</div></td>
                <td className="num">{c.montoEstimado ? `S/ ${Number(c.montoEstimado).toFixed(2)}` : '—'}</td>
                <td><span className={badgeClass(c.estado)}>{labelEstado(c.estado)}</span></td>
                <td><div className="a-row-actions"><button className="a-iconbtn" onClick={() => abrir(c)}><Eye size={15} /></button></div></td>
              </tr>
            ))}
            {!loading && filtrados.length === 0 && <tr><td colSpan={5} className="a-empty">No hay cotizaciones.</td></tr>}
          </tbody>
        </table>
      </div>

      {ver && (
        <Modal title={`Cotización ${ver.codigo}`} onClose={() => setVer(null)} wide
          footer={<>
            <button className="a-btn" onClick={() => setVer(null)}>Cancelar</button>
            <button className="a-btn primary" onClick={guardar} disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
          </>}>
          <div style={{ marginBottom: 16, fontSize: 14 }}>
            <div className="a-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>Cliente</div>
            <div>{ver.lead?.nombre} · {ver.lead?.email}</div>
          </div>
          {ver.items?.length > 0 && (
            <div className="a-panel" style={{ marginBottom: 16 }}>
              <table className="a-table">
                <thead><tr><th>Descripción</th><th className="num">Cant.</th><th className="num">P. unit.</th></tr></thead>
                <tbody>
                  {ver.items.map((it: any) => (
                    <tr key={it.id}><td>{it.descripcion}</td><td className="num">{it.cantidad}</td><td className="num">{it.precioUnitario ? `S/ ${Number(it.precioUnitario).toFixed(2)}` : '—'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="a-grid2">
            <Field label="Estado"><Select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>{ESTADO_COTIZACION.map((e) => <option key={e} value={e}>{labelEstado(e)}</option>)}</Select></Field>
            <Field label="Monto estimado (S/)"><Input type="number" value={form.montoEstimado} onChange={(e) => setForm({ ...form, montoEstimado: e.target.value })} /></Field>
          </div>
          <Field label="Notas internas"><Textarea value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} /></Field>
        </Modal>
      )}
    </>
  );
}

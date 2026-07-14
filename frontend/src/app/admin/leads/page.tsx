'use client';
import { useEffect, useMemo, useState } from 'react';
import { Eye, ReceiptText } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { ESTADO_LEAD, badgeClass, labelEstado, areaLabel } from '@/lib/adminConst';
import { Modal, Field, Input, Textarea, Select, SearchBox, useToast } from '@/components/admin/ui';

export default function LeadsAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filtro, setFiltro] = useState('');
  const [ver, setVer] = useState<any | null>(null);
  const [cot, setCot] = useState<any | null>(null);
  const [cotForm, setCotForm] = useState({ notas: '', montoEstimado: '', descripcion: '' });
  const [saving, setSaving] = useState(false);

  async function cargar() {
    setLoading(true);
    try { setItems(await adminApi.leads.list(filtro || undefined)); } catch (e: any) { toast(e.message, 'err'); }
    setLoading(false);
  }
  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [filtro]);

  const filtrados = useMemo(() => items.filter((l) =>
    l.nombre.toLowerCase().includes(q.toLowerCase()) ||
    l.email.toLowerCase().includes(q.toLowerCase()) ||
    (l.empresa || '').toLowerCase().includes(q.toLowerCase())
  ), [items, q]);

  async function cambiarEstado(l: any, estado: string) {
    try { await adminApi.leads.update(l.id, { estado }); toast('Estado actualizado.'); setVer({ ...l, estado }); cargar(); }
    catch (e: any) { toast(e.message, 'err'); }
  }

  async function crearCotizacion() {
    if (!cot) return;
    setSaving(true);
    try {
      await adminApi.cotizaciones.create({
        leadId: cot.id,
        notas: cotForm.notas || undefined,
        montoEstimado: cotForm.montoEstimado ? Number(cotForm.montoEstimado) : undefined,
        items: cotForm.descripcion ? [{ descripcion: cotForm.descripcion, cantidad: 1 }] : undefined,
      });
      toast('Cotización creada.');
      setCot(null); setCotForm({ notas: '', montoEstimado: '', descripcion: '' }); cargar();
    } catch (e: any) { toast(e.message, 'err'); }
    setSaving(false);
  }

  return (
    <>
      <div className="a-pagehead">
        <div><h1>Clientes potenciales</h1><p>Solicitudes recibidas desde la web. {items.length} registro(s).</p></div>
      </div>

      <div className="a-panel">
        <div className="a-panel-head">
          <div className="a-filters">
            <div style={{ width: 240 }}><SearchBox value={q} onChange={setQ} placeholder="Buscar nombre, correo…" /></div>
            <select className="a-select" style={{ width: 180 }} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="">Todos los estados</option>
              {ESTADO_LEAD.map((e) => <option key={e} value={e}>{labelEstado(e)}</option>)}
            </select>
          </div>
        </div>
        <table className="a-table">
          <thead><tr><th>Nombre</th><th>Empresa</th><th>Área</th><th>Fecha</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="a-empty">Cargando…</td></tr>}
            {!loading && filtrados.map((l) => (
              <tr key={l.id}>
                <td>{l.nombre}<div className="a-muted" style={{ fontSize: 12 }}>{l.email}</div></td>
                <td className="a-muted">{l.empresa || '—'}</td>
                <td className="a-muted">{areaLabel(l.area)}</td>
                <td className="a-muted" style={{ fontSize: 13 }}>{new Date(l.createdAt).toLocaleDateString('es-PE')}</td>
                <td><span className={badgeClass(l.estado)}>{labelEstado(l.estado)}</span></td>
                <td><div className="a-row-actions">
                  <button className="a-iconbtn" title="Ver detalle" onClick={() => setVer(l)}><Eye size={15} /></button>
                  <button className="a-iconbtn" title="Crear cotización" onClick={() => setCot(l)}><ReceiptText size={15} /></button>
                </div></td>
              </tr>
            ))}
            {!loading && filtrados.length === 0 && <tr><td colSpan={6} className="a-empty">No hay clientes potenciales.</td></tr>}
          </tbody>
        </table>
      </div>

      {ver && (
        <Modal title="Detalle del cliente potencial" onClose={() => setVer(null)}
          footer={<button className="a-btn" onClick={() => setVer(null)}>Cerrar</button>}>
          <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
            <Dato k="Nombre" v={ver.nombre} />
            <Dato k="Empresa" v={ver.empresa || '—'} />
            <Dato k="Correo" v={<a href={`mailto:${ver.email}`} style={{ color: 'var(--teal-soft)' }}>{ver.email}</a>} />
            <Dato k="Teléfono" v={ver.telefono ? <a href={`tel:${ver.telefono}`} style={{ color: 'var(--teal-soft)' }}>{ver.telefono}</a> : '—'} />
            <Dato k="Ciudad" v={ver.ciudad || '—'} />
            <Dato k="Área" v={areaLabel(ver.area)} />
            <Dato k="Origen" v={ver.origen || '—'} />
            <div>
              <div className="a-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 4 }}>Mensaje</div>
              <div style={{ background: 'rgba(7,11,31,.5)', border: '1px solid var(--a-line)', borderRadius: 10, padding: 12 }}>{ver.mensaje}</div>
            </div>
            <Field label="Cambiar estado">
              <Select value={ver.estado} onChange={(e) => cambiarEstado(ver, e.target.value)}>
                {ESTADO_LEAD.map((e) => <option key={e} value={e}>{labelEstado(e)}</option>)}
              </Select>
            </Field>
          </div>
        </Modal>
      )}

      {cot && (
        <Modal title={`Nueva cotización · ${cot.nombre}`} onClose={() => setCot(null)}
          footer={<>
            <button className="a-btn" onClick={() => setCot(null)}>Cancelar</button>
            <button className="a-btn primary" onClick={crearCotizacion} disabled={saving}>{saving ? 'Creando…' : 'Crear cotización'}</button>
          </>}>
          <Field label="Descripción / servicio"><Input value={cotForm.descripcion} onChange={(e) => setCotForm({ ...cotForm, descripcion: e.target.value })} placeholder="Ej. Desarrollo de sistema web" /></Field>
          <Field label="Monto estimado (S/)"><Input type="number" value={cotForm.montoEstimado} onChange={(e) => setCotForm({ ...cotForm, montoEstimado: e.target.value })} /></Field>
          <Field label="Notas internas"><Textarea value={cotForm.notas} onChange={(e) => setCotForm({ ...cotForm, notas: e.target.value })} /></Field>
        </Modal>
      )}
    </>
  );
}

function Dato({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid var(--a-line-soft)', paddingBottom: 8 }}>
      <span className="a-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{k}</span>
      <span style={{ textAlign: 'right' }}>{v}</span>
    </div>
  );
}

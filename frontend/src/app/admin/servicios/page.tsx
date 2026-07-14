'use client';
import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { AREAS_OPCIONES, areaLabel } from '@/lib/adminConst';
import { Modal, Confirm, Field, Input, Textarea, Select, Toggle, SearchBox, useToast } from '@/components/admin/ui';

type Servicio = any;
const vacio = { slug: '', titulo: '', resumen: '', descripcion: '', area: 'INGENIERIA_SISTEMAS', icono: '', precioReferencial: '', destacado: false, activo: true, orden: 0 };

export default function ServiciosAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filtroArea, setFiltroArea] = useState('');
  const [edit, setEdit] = useState<Servicio | null>(null);
  const [form, setForm] = useState<any>(vacio);
  const [saving, setSaving] = useState(false);
  const [delItem, setDelItem] = useState<Servicio | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  async function cargar() {
    setLoading(true);
    try { setItems(await adminApi.servicios.list()); } catch (e: any) { toast(e.message, 'err'); }
    setLoading(false);
  }
  useEffect(() => { cargar(); }, []);

  const filtrados = useMemo(() => items.filter((s) =>
    (!filtroArea || s.area === filtroArea) &&
    (s.titulo.toLowerCase().includes(q.toLowerCase()) || s.slug.includes(q.toLowerCase()))
  ), [items, q, filtroArea]);

  const cerrar = () => { setEdit(null); setForm(vacio); setModalAbierto(false); };
  function nuevo() { setEdit(null); setForm(vacio); setModalAbierto(true); }
  function editar(s: Servicio) {
    setEdit(s);
    setForm({ ...vacio, ...s, precioReferencial: s.precioReferencial ?? '', icono: s.icono ?? '' });
    setModalAbierto(true);
  }

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  async function guardar() {
    setSaving(true);
    try {
      const dto: any = {
        titulo: form.titulo, resumen: form.resumen, descripcion: form.descripcion,
        area: form.area, icono: form.icono || undefined,
        precioReferencial: form.precioReferencial === '' ? undefined : Number(form.precioReferencial),
        destacado: form.destacado, activo: form.activo, orden: Number(form.orden) || 0,
      };
      if (edit) await adminApi.servicios.update(edit.id, dto);
      else await adminApi.servicios.create({ ...dto, slug: form.slug || form.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') });
      toast(edit ? 'Servicio actualizado.' : 'Servicio creado.');
      cerrar(); cargar();
    } catch (e: any) { toast(e.message, 'err'); }
    setSaving(false);
  }

  async function toggle(s: Servicio, campo: 'activo' | 'destacado') {
    try { await adminApi.servicios.update(s.id, { [campo]: !s[campo] }); cargar(); }
    catch (e: any) { toast(e.message, 'err'); }
  }

  async function eliminar() {
    if (!delItem) return;
    try { await adminApi.servicios.remove(delItem.id); toast('Servicio eliminado.'); setDelItem(null); cargar(); }
    catch (e: any) { toast(e.message, 'err'); setDelItem(null); }
  }

  return (
    <>
      <div className="a-pagehead">
        <div><h1>Servicios</h1><p>Administra el catálogo que ve el cliente en la web.</p></div>
        <button className="a-btn primary" onClick={nuevo}><Plus size={15} /> Nuevo servicio</button>
      </div>

      <div className="a-panel">
        <div className="a-panel-head">
          <div className="a-filters">
            <div style={{ width: 240 }}><SearchBox value={q} onChange={setQ} placeholder="Buscar servicio…" /></div>
            <select className="a-select" style={{ width: 220 }} value={filtroArea} onChange={(e) => setFiltroArea(e.target.value)}>
              <option value="">Todas las áreas</option>
              {AREAS_OPCIONES.map((a) => <option key={a.v} value={a.v}>{a.l}</option>)}
            </select>
          </div>
          <span className="a-muted" style={{ fontSize: 13 }}>{filtrados.length} de {items.length}</span>
        </div>

        <table className="a-table">
          <thead><tr><th>Servicio</th><th>Área</th><th>Activo</th><th>Destacado</th><th></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="a-empty">Cargando…</td></tr>}
            {!loading && filtrados.map((s) => (
              <tr key={s.id}>
                <td>
                  <div>{s.titulo}</div>
                  <div className="a-muted" style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>/{s.slug}</div>
                </td>
                <td className="a-muted">{areaLabel(s.area)}</td>
                <td><Toggle on={s.activo} onClick={() => toggle(s, 'activo')} /></td>
                <td>
                  <button className="a-iconbtn" onClick={() => toggle(s, 'destacado')} title="Destacar"
                    style={{ color: s.destacado ? 'var(--gold)' : 'var(--ink-mute)', borderColor: s.destacado ? 'var(--gold)' : 'var(--a-line)' }}>
                    <Star size={15} fill={s.destacado ? 'var(--gold)' : 'none'} />
                  </button>
                </td>
                <td>
                  <div className="a-row-actions">
                    <button className="a-iconbtn" onClick={() => editar(s)} title="Editar"><Pencil size={15} /></button>
                    <button className="a-iconbtn danger" onClick={() => setDelItem(s)} title="Eliminar"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtrados.length === 0 && <tr><td colSpan={5} className="a-empty">No hay servicios que coincidan.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <Modal title={edit ? 'Editar servicio' : 'Nuevo servicio'} onClose={cerrar} wide
          footer={<>
            <button className="a-btn" onClick={cerrar}>Cancelar</button>
            <button className="a-btn primary" onClick={guardar} disabled={saving || !form.titulo}>{saving ? 'Guardando…' : 'Guardar'}</button>
          </>}>
          <Field label="Título *"><Input value={form.titulo} onChange={(e) => set('titulo', e.target.value)} /></Field>
          {!edit && <Field label="Slug (URL) — opcional, se genera solo"><Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="ej. desarrollo-web" /></Field>}
          <Field label="Resumen *"><Input value={form.resumen} onChange={(e) => set('resumen', e.target.value)} /></Field>
          <Field label="Descripción *"><Textarea value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} /></Field>
          <div className="a-grid2">
            <Field label="Área"><Select value={form.area} onChange={(e) => set('area', e.target.value)}>{AREAS_OPCIONES.map((a) => <option key={a.v} value={a.v}>{a.l}</option>)}</Select></Field>
            <Field label="Precio referencial (S/)"><Input type="number" value={form.precioReferencial} onChange={(e) => set('precioReferencial', e.target.value)} /></Field>
            <Field label="Icono (opcional)"><Input value={form.icono} onChange={(e) => set('icono', e.target.value)} placeholder="ej. code" /></Field>
            <Field label="Orden"><Input type="number" value={form.orden} onChange={(e) => set('orden', e.target.value)} /></Field>
          </div>
          <div style={{ display: 'flex', gap: 30, marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}><Toggle on={form.activo} onClick={() => set('activo', !form.activo)} /> Activo</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}><Toggle on={form.destacado} onClick={() => set('destacado', !form.destacado)} /> Destacado</label>
          </div>
        </Modal>
      )}

      {delItem && (
        <Confirm title="Eliminar servicio" message={`¿Eliminar "${delItem.titulo}"? Esta acción no se puede deshacer.`}
          onCancel={() => setDelItem(null)} onConfirm={eliminar} />
      )}
    </>
  );
}

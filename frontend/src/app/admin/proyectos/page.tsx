'use client';
import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { AREAS_OPCIONES, ESTADO_PROYECTO, areaLabel, badgeClass, labelEstado } from '@/lib/adminConst';
import { Modal, Confirm, Field, Input, Textarea, Select, Toggle, SearchBox, useToast } from '@/components/admin/ui';

const vacio = { slug: '', titulo: '', cliente: '', resumen: '', descripcion: '', area: 'INGENIERIA_INDUSTRIAL', imagenUrl: '', resultados: '', estado: 'FINALIZADO', destacado: false, publicado: true, orden: 0 };

export default function ProyectosAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<any | null>(null);
  const [form, setForm] = useState<any>(vacio);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);
  const [delItem, setDelItem] = useState<any | null>(null);

  async function cargar() {
    setLoading(true);
    try { setItems(await adminApi.proyectos.list()); } catch (e: any) { toast(e.message, 'err'); }
    setLoading(false);
  }
  useEffect(() => { cargar(); }, []);

  const filtrados = useMemo(() => items.filter((p) => p.titulo.toLowerCase().includes(q.toLowerCase())), [items, q]);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const cerrar = () => { setModal(false); setEdit(null); setForm(vacio); };
  function nuevo() { setEdit(null); setForm(vacio); setModal(true); }
  function editar(p: any) { setEdit(p); setForm({ ...vacio, ...p, cliente: p.cliente ?? '', imagenUrl: p.imagenUrl ?? '', resultados: p.resultados ?? '' }); setModal(true); }

  async function guardar() {
    setSaving(true);
    try {
      const dto: any = {
        titulo: form.titulo, cliente: form.cliente || undefined, resumen: form.resumen,
        descripcion: form.descripcion, area: form.area, imagenUrl: form.imagenUrl || undefined,
        resultados: form.resultados || undefined, estado: form.estado, destacado: form.destacado,
        publicado: form.publicado, orden: Number(form.orden) || 0,
      };
      if (edit) await adminApi.proyectos.update(edit.id, dto);
      else await adminApi.proyectos.create({ ...dto, slug: form.slug || form.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') });
      toast(edit ? 'Proyecto actualizado.' : 'Proyecto creado.');
      cerrar(); cargar();
    } catch (e: any) { toast(e.message, 'err'); }
    setSaving(false);
  }
  async function togglePub(p: any) { try { await adminApi.proyectos.update(p.id, { publicado: !p.publicado }); cargar(); } catch (e: any) { toast(e.message, 'err'); } }
  async function eliminar() { if (!delItem) return; try { await adminApi.proyectos.remove(delItem.id); toast('Proyecto eliminado.'); setDelItem(null); cargar(); } catch (e: any) { toast(e.message, 'err'); setDelItem(null); } }

  return (
    <>
      <div className="a-pagehead">
        <div><h1>Portafolio</h1><p>Casos y proyectos que se muestran públicamente.</p></div>
        <button className="a-btn primary" onClick={nuevo}><Plus size={15} /> Nuevo proyecto</button>
      </div>

      <div className="a-panel">
        <div className="a-panel-head">
          <div style={{ width: 260 }}><SearchBox value={q} onChange={setQ} placeholder="Buscar proyecto…" /></div>
          <span className="a-muted" style={{ fontSize: 13 }}>{filtrados.length} de {items.length}</span>
        </div>
        <table className="a-table">
          <thead><tr><th>Proyecto</th><th>Área</th><th>Estado</th><th>Publicado</th><th></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="a-empty">Cargando…</td></tr>}
            {!loading && filtrados.map((p) => (
              <tr key={p.id}>
                <td>{p.titulo}<div className="a-muted" style={{ fontSize: 12 }}>{p.cliente || '—'}</div></td>
                <td className="a-muted">{areaLabel(p.area)}</td>
                <td><span className={badgeClass(p.estado)}>{labelEstado(p.estado)}</span></td>
                <td><Toggle on={p.publicado} onClick={() => togglePub(p)} /></td>
                <td><div className="a-row-actions">
                  <button className="a-iconbtn" onClick={() => editar(p)}><Pencil size={15} /></button>
                  <button className="a-iconbtn danger" onClick={() => setDelItem(p)}><Trash2 size={15} /></button>
                </div></td>
              </tr>
            ))}
            {!loading && filtrados.length === 0 && <tr><td colSpan={5} className="a-empty">No hay proyectos.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={edit ? 'Editar proyecto' : 'Nuevo proyecto'} onClose={cerrar} wide
          footer={<>
            <button className="a-btn" onClick={cerrar}>Cancelar</button>
            <button className="a-btn primary" onClick={guardar} disabled={saving || !form.titulo}>{saving ? 'Guardando…' : 'Guardar'}</button>
          </>}>
          <Field label="Título *"><Input value={form.titulo} onChange={(e) => set('titulo', e.target.value)} /></Field>
          <div className="a-grid2">
            <Field label="Cliente"><Input value={form.cliente} onChange={(e) => set('cliente', e.target.value)} /></Field>
            <Field label="Área"><Select value={form.area} onChange={(e) => set('area', e.target.value)}>{AREAS_OPCIONES.map((a) => <option key={a.v} value={a.v}>{a.l}</option>)}</Select></Field>
          </div>
          <Field label="Resumen *"><Input value={form.resumen} onChange={(e) => set('resumen', e.target.value)} /></Field>
          <Field label="Descripción *"><Textarea value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} /></Field>
          <Field label="Resultados / impacto"><Textarea value={form.resultados} onChange={(e) => set('resultados', e.target.value)} /></Field>
          <Field label="URL de imagen"><Input value={form.imagenUrl} onChange={(e) => set('imagenUrl', e.target.value)} placeholder="https://…" /></Field>
          <div className="a-grid2">
            <Field label="Estado"><Select value={form.estado} onChange={(e) => set('estado', e.target.value)}>{ESTADO_PROYECTO.map((e) => <option key={e} value={e}>{labelEstado(e)}</option>)}</Select></Field>
            <Field label="Orden"><Input type="number" value={form.orden} onChange={(e) => set('orden', e.target.value)} /></Field>
          </div>
          <div style={{ display: 'flex', gap: 30 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}><Toggle on={form.publicado} onClick={() => set('publicado', !form.publicado)} /> Publicado</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}><Toggle on={form.destacado} onClick={() => set('destacado', !form.destacado)} /> Destacado</label>
          </div>
        </Modal>
      )}
      {delItem && <Confirm title="Eliminar proyecto" message={`¿Eliminar "${delItem.titulo}"?`} onCancel={() => setDelItem(null)} onConfirm={eliminar} />}
    </>
  );
}

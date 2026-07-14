'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, UserX } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { ROLES } from '@/lib/adminConst';
import { auth } from '@/lib/auth';
import { Modal, Confirm, Field, Input, Select, useToast } from '@/components/admin/ui';

export default function UsuariosAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any | null>(null);
  const [form, setForm] = useState<any>({ nombre: '', email: '', password: '', rol: 'EDITOR' });
  const [saving, setSaving] = useState(false);
  const [desactivar, setDesactivar] = useState<any | null>(null);
  const yo = auth.user();

  async function cargar() {
    setLoading(true);
    try { setItems(await adminApi.usuarios.list()); } catch (e: any) { toast(e.message, 'err'); }
    setLoading(false);
  }
  useEffect(() => { cargar(); }, []);

  function nuevo() { setEdit(null); setForm({ nombre: '', email: '', password: '', rol: 'EDITOR' }); setModal(true); }
  function editar(u: any) { setEdit(u); setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol }); setModal(true); }

  async function guardar() {
    setSaving(true);
    try {
      if (edit) await adminApi.usuarios.update(edit.id, { nombre: form.nombre, rol: form.rol });
      else await adminApi.usuarios.create({ nombre: form.nombre, email: form.email, password: form.password, rol: form.rol });
      toast(edit ? 'Usuario actualizado.' : 'Usuario creado.'); setModal(false); cargar();
    } catch (e: any) { toast(e.message, 'err'); }
    setSaving(false);
  }

  async function confirmarDesactivar() {
    if (!desactivar) return;
    try { await adminApi.usuarios.remove(desactivar.id); toast('Usuario desactivado.'); setDesactivar(null); cargar(); }
    catch (e: any) { toast(e.message, 'err'); setDesactivar(null); }
  }

  return (
    <>
      <div className="a-pagehead">
        <div><h1>Usuarios</h1><p>Cuentas con acceso al panel administrativo y sus permisos.</p></div>
        <button className="a-btn primary" onClick={nuevo}><Plus size={15} /> Nuevo usuario</button>
      </div>

      <div className="a-panel">
        <table className="a-table">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Último acceso</th><th></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="a-empty">Cargando…</td></tr>}
            {!loading && items.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}{yo?.id === u.id && <span className="a-badge info" style={{ marginLeft: 8 }}>tú</span>}</td>
                <td className="a-muted">{u.email}</td>
                <td><span className="a-badge">{u.rol}</span></td>
                <td>{u.activo ? <span className="a-badge ok">Activo</span> : <span className="a-badge bad">Inactivo</span>}</td>
                <td className="a-muted" style={{ fontSize: 13 }}>{u.ultimoAcceso ? new Date(u.ultimoAcceso).toLocaleString('es-PE') : '—'}</td>
                <td><div className="a-row-actions">
                  <button className="a-iconbtn" onClick={() => editar(u)}><Pencil size={15} /></button>
                  {yo?.id !== u.id && u.activo && <button className="a-iconbtn danger" title="Desactivar" onClick={() => setDesactivar(u)}><UserX size={15} /></button>}
                </div></td>
              </tr>
            ))}
            {!loading && items.length === 0 && <tr><td colSpan={6} className="a-empty">No hay usuarios.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={edit ? 'Editar usuario' : 'Nuevo usuario'} onClose={() => setModal(false)}
          footer={<>
            <button className="a-btn" onClick={() => setModal(false)}>Cancelar</button>
            <button className="a-btn primary" onClick={guardar} disabled={saving || !form.nombre || (!edit && (!form.email || form.password.length < 8))}>{saving ? 'Guardando…' : 'Guardar'}</button>
          </>}>
          <Field label="Nombre *"><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Field>
          {!edit && <Field label="Correo *"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>}
          {!edit && <Field label="Contraseña * (mín. 8)"><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>}
          <Field label="Rol"><Select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}</Select></Field>
        </Modal>
      )}
      {desactivar && <Confirm title="Desactivar usuario" message={`¿Desactivar a "${desactivar.nombre}"? No podrá iniciar sesión.`} confirmLabel="Desactivar" onCancel={() => setDesactivar(null)} onConfirm={confirmarDesactivar} />}
    </>
  );
}

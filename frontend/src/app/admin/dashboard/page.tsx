'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [resumen, setResumen] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('dmg_token');
    if (!token) { router.push('/admin/login'); return; }
    Promise.all([api.resumen(token), api.leadsAdmin(token)])
      .then(([r, l]) => { setResumen(r); setLeads(l.slice(0, 8)); })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar.'));
  }, [router]);

  function salir() {
    sessionStorage.removeItem('dmg_token');
    sessionStorage.removeItem('dmg_user');
    router.push('/admin/login');
  }

  const metricas = resumen ? [
    { k: 'Visitas (30d)', v: resumen.visitas30d },
    { k: 'Leads totales', v: resumen.totalLeads },
    { k: 'Leads nuevos', v: resumen.leadsNuevos },
    { k: 'Cotizaciones', v: resumen.cotizaciones },
    { k: 'Servicios activos', v: resumen.serviciosActivos },
  ] : [];

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <div>
            <span className="eyebrow">Panel administrativo</span>
            <h1 style={{ fontSize: '2rem', marginTop: 12 }}>Dashboard</h1>
          </div>
          <button className="btn btn-ghost" onClick={salir}>Cerrar sesión</button>
        </div>

        {error && <p style={{ color: '#ff8f8f' }}>{error}</p>}
        {!resumen && !error && <p style={{ color: 'var(--ink-mute)' }}>Cargando métricas…</p>}

        {resumen && (
          <>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 40 }}>
              {metricas.map((m) => (
                <div key={m.k} className="card" style={{ padding: 20 }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>{m.k}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginTop: 8 }}>{m.v}</p>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '1.3rem', marginBottom: 18 }}>Últimos clientes potenciales</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)' }}>
                    <th style={th}>Nombre</th><th style={th}>Empresa</th><th style={th}>Correo</th><th style={th}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} style={{ borderTop: '1px solid var(--line)' }}>
                      <td style={td}>{l.nombre}</td>
                      <td style={{ ...td, color: 'var(--ink-soft)' }}>{l.empresa || '—'}</td>
                      <td style={{ ...td, color: 'var(--ink-soft)' }}>{l.email}</td>
                      <td style={td}><span className="chip">{l.estado}</span></td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr><td style={td} colSpan={4}><span style={{ color: 'var(--ink-mute)' }}>Aún no hay solicitudes.</span></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

const th: React.CSSProperties = { padding: '14px 18px', fontWeight: 400 };
const td: React.CSSProperties = { padding: '14px 18px' };

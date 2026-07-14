'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users2, Receipt, Boxes, Eye, ArrowUpRight } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { badgeClass, labelEstado } from '@/lib/adminConst';

export default function DashboardPage() {
  const [resumen, setResumen] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminApi.analytics.resumen(), adminApi.leads.list()])
      .then(([r, l]) => { setResumen(r); setLeads(l.slice(0, 6)); })
      .catch((e) => setError(e.message));
  }, []);

  const metrics = resumen ? [
    { k: 'Visitas (30d)', v: resumen.visitas30d, icon: Eye },
    { k: 'Leads totales', v: resumen.totalLeads, icon: Users2 },
    { k: 'Leads nuevos', v: resumen.leadsNuevos, icon: ArrowUpRight },
    { k: 'Cotizaciones', v: resumen.cotizaciones, icon: Receipt },
    { k: 'Servicios activos', v: resumen.serviciosActivos, icon: Boxes },
  ] : [];

  return (
    <>
      <div className="a-pagehead">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general de la actividad de los últimos 30 días.</p>
        </div>
      </div>

      {error && <p style={{ color: '#ff9d9d' }}>{error}</p>}
      {!resumen && !error && <p className="a-muted">Cargando métricas…</p>}

      {resumen && (
        <>
          <div className="a-metrics">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.k} className="a-metric">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="k">{m.k}</span>
                    <Icon size={16} color="var(--teal)" />
                  </div>
                  <div className="v">{m.v}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, alignItems: 'start' }}>
            <div className="a-panel">
              <div className="a-panel-head">
                <strong>Últimos clientes potenciales</strong>
                <Link href="/admin/leads" className="a-btn sm">Ver todos</Link>
              </div>
              <table className="a-table">
                <thead><tr><th>Nombre</th><th>Empresa</th><th>Estado</th></tr></thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id}>
                      <td>{l.nombre}<div className="a-muted" style={{ fontSize: 12 }}>{l.email}</div></td>
                      <td className="a-muted">{l.empresa || '—'}</td>
                      <td><span className={badgeClass(l.estado)}>{labelEstado(l.estado)}</span></td>
                    </tr>
                  ))}
                  {leads.length === 0 && <tr><td colSpan={3} className="a-empty">Aún no hay solicitudes.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="a-panel">
              <div className="a-panel-head"><strong>Páginas más visitadas</strong></div>
              <table className="a-table">
                <thead><tr><th>Página</th><th className="num">Visitas</th></tr></thead>
                <tbody>
                  {(resumen.topPaths || []).map((p: any) => (
                    <tr key={p.path}><td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{p.path}</td><td className="num">{p.visitas}</td></tr>
                  ))}
                  {(!resumen.topPaths || resumen.topPaths.length === 0) && <tr><td colSpan={2} className="a-empty">Sin datos todavía.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}

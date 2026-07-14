'use client';
import { useEffect, useState } from 'react';
import { Globe, MapPin, Monitor, Eye, Users } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

function BarList({ title, icon, rows, empty }: { title: string; icon: React.ReactNode; rows: { valor: string; visitas: number }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.visitas));
  return (
    <div className="a-panel">
      <div className="a-panel-head"><strong style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{icon} {title}</strong></div>
      <div style={{ padding: '8px 20px 18px' }}>
        {rows.length === 0 && <div className="a-empty">{empty}</div>}
        {rows.map((r) => (
          <div key={r.valor} style={{ margin: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
              <span>{r.valor || '—'}</span><span className="a-muted">{r.visitas}</span>
            </div>
            <div style={{ height: 7, background: 'rgba(38,49,115,.4)', borderRadius: 999 }}>
              <div style={{ width: `${(r.visitas / max) * 100}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--gold), var(--teal))' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnaliticaAdmin() {
  const [d, setD] = useState<any>(null);
  const [error, setError] = useState('');
  useEffect(() => { adminApi.analytics.resumen().then(setD).catch((e) => setError(e.message)); }, []);

  if (error) return <p style={{ color: '#ff9d9d' }}>{error}</p>;
  if (!d) return <p className="a-muted">Cargando analítica…</p>;

  const maxSerie = Math.max(1, ...d.serie.map((s: any) => s.visitas));
  const metrics = [
    { k: 'Visitas totales', v: d.totalVisitas, icon: Eye },
    { k: 'Últimos 30 días', v: d.visitas30d, icon: Users },
    { k: 'Hoy', v: d.visitasHoy, icon: Eye },
  ];

  return (
    <>
      <div className="a-pagehead">
        <div><h1>Analítica de visitantes</h1><p>De dónde se conectan, con qué dispositivo y qué páginas ven. Datos anónimos y respetuosos de la privacidad.</p></div>
      </div>

      <div className="a-metrics">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.k} className="a-metric">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="k">{m.k}</span><Icon size={16} color="var(--teal)" />
              </div>
              <div className="v">{m.v}</div>
            </div>
          );
        })}
      </div>

      {/* Serie temporal */}
      <div className="a-panel" style={{ marginBottom: 20 }}>
        <div className="a-panel-head"><strong>Visitas por día (últimos 14 días)</strong></div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 150, padding: '20px 24px' }}>
          {d.serie.map((s: any) => (
            <div key={s.dia} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div title={`${s.visitas} visitas`} style={{ width: '100%', height: `${(s.visitas / maxSerie) * 110}px`, minHeight: 3, borderRadius: 5, background: 'linear-gradient(180deg, var(--teal), rgba(47,240,214,.25))' }} />
              <span style={{ fontSize: 9, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>{s.dia.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        <BarList title="Países" icon={<Globe size={16} color="var(--teal)" />} rows={d.porPais} empty="Sin datos de país. Se detecta al desplegar con un CDN (Vercel/Cloudflare)." />
        <BarList title="Ciudades" icon={<MapPin size={16} color="var(--teal)" />} rows={d.porCiudad} empty="Sin datos de ciudad todavía." />
        <BarList title="Dispositivos" icon={<Monitor size={16} color="var(--teal)" />} rows={d.porDispositivo.map((x: any) => ({ valor: x.valor, visitas: x.visitas }))} empty="Sin datos." />
        <BarList title="Navegadores" icon={<Monitor size={16} color="var(--teal)" />} rows={d.porNavegador} empty="Sin datos." />
        <BarList title="Sistemas operativos" icon={<Monitor size={16} color="var(--teal)" />} rows={d.porSO} empty="Sin datos." />
        <BarList title="Páginas más vistas" icon={<Eye size={16} color="var(--teal)" />} rows={d.topPaths.map((p: any) => ({ valor: p.path, visitas: p.visitas }))} empty="Sin datos." />
      </div>
    </>
  );
}

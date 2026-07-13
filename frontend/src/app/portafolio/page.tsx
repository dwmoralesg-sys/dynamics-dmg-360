import { areaMeta } from '@/lib/areas';
import { api } from '@/lib/api';
import { SAMPLE_PROYECTOS } from '@/lib/sample';

export const metadata = { title: 'Portafolio · Dynamics DMG 360' };

async function getProyectos() {
  try { return await api.proyectos(); } catch { return SAMPLE_PROYECTOS; }
}

export default async function PortafolioPage() {
  const proyectos = await getProyectos();
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Portafolio</span>
        <h1 style={{ fontSize: '2.4rem', marginTop: 16, marginBottom: 12 }}>Proyectos y casos</h1>
        <p className="lead" style={{ marginBottom: 44 }}>
          Una muestra del impacto que generamos integrando negocio, procesos y tecnología.
        </p>
        <div className="grid grid-2">
          {proyectos.map((p) => {
            const meta = areaMeta(p.area);
            return (
              <article key={p.id} className="card">
                <span className="chip" data-area={meta.tag}>{meta.label}</span>
                <h3 style={{ fontSize: '1.25rem', margin: '14px 0 8px' }}>{p.titulo}</h3>
                {p.cliente && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)' }}>
                    Cliente: {p.cliente}
                  </p>
                )}
                <p style={{ color: 'var(--ink-soft)', marginTop: 12 }}>{p.resumen}</p>
                {p.resultados && (
                  <p style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)', color: 'var(--teal-soft)', fontSize: 14 }}>
                    ↗ {p.resultados}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

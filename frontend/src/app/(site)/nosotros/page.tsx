import { getGrupo } from '@/lib/site';

export const metadata = { title: 'Nosotros · Dynamics DMG 360' };

const MISION = 'Brindar soluciones integrales en administración, ingeniería industrial y tecnología, ayudando a personas y organizaciones a optimizar sus procesos, modernizar sus operaciones e implementar soluciones innovadoras que generen eficiencia y crecimiento.';
const VISION = 'Para 2031, consolidar a Dynamics DMG 360 como una empresa peruana reconocida en soluciones integrales de gestión, ingeniería y tecnología, con presencia nacional y capacidad de atender proyectos en Latinoamérica.';

export default async function NosotrosPage() {
  const c = await getGrupo('nosotros');
  const mision = c['nosotros.mision'] || MISION;
  const vision = c['nosotros.vision'] || VISION;
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <span className="eyebrow">Nosotros</span>
        <h1 style={{ fontSize: '2.4rem', marginTop: 16, marginBottom: 20 }}>
          Una solución 360° para personas y organizaciones
        </h1>
        <p className="lead">
          Dynamics DMG 360 integra tres mundos que suelen ir por separado —administración y
          negocios internacionales, ingeniería industrial e ingeniería de sistemas— en una sola
          propuesta: <strong style={{ color: 'var(--ink)' }}>Negocio → Procesos → Tecnología.</strong>
        </p>

        <div className="grid grid-2" style={{ marginTop: 44 }}>
          <div className="card" style={{ borderColor: 'rgba(246,196,69,.4)' }}>
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>Misión</p>
            <p style={{ marginTop: 14, color: 'var(--ink-soft)' }}>{mision}</p>
          </div>
          <div className="card" style={{ borderColor: 'rgba(47,240,214,.4)' }}>
            <p className="eyebrow" style={{ color: 'var(--teal)' }}>Visión 2031</p>
            <p style={{ marginTop: 14, color: 'var(--ink-soft)' }}>{vision}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

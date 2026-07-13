export const metadata = { title: 'Nosotros · Dynamics DMG 360' };

export default function NosotrosPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <span className="eyebrow">Nosotros</span>
        <h1 style={{ fontSize: '2.4rem', marginTop: 16, marginBottom: 20 }}>
          Una solución 360° para personas y organizaciones
        </h1>
        <p className="lead">
          Dynamics DMG 360 integra tres mundos que suelen ir por separado —administración y
          negocios, ingeniería industrial e ingeniería de sistemas— en una sola propuesta:
          <strong style={{ color: 'var(--ink)' }}> Negocio → Procesos → Tecnología.</strong>
        </p>

        <div className="grid grid-2" style={{ marginTop: 44 }}>
          <div className="card" style={{ borderColor: 'rgba(240,180,41,.4)' }}>
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>Misión</p>
            <p style={{ marginTop: 14, color: 'var(--ink-soft)' }}>
              Brindar soluciones integrales en administración, ingeniería industrial y tecnología,
              ayudando a personas y organizaciones a optimizar sus procesos, modernizar sus
              operaciones e implementar soluciones innovadoras que generen eficiencia y crecimiento.
            </p>
          </div>
          <div className="card" style={{ borderColor: 'rgba(45,212,191,.4)' }}>
            <p className="eyebrow" style={{ color: 'var(--teal)' }}>Visión 2031</p>
            <p style={{ marginTop: 14, color: 'var(--ink-soft)' }}>
              Consolidar a Dynamics DMG 360 como una empresa peruana reconocida en soluciones
              integrales de gestión, ingeniería y tecnología, con presencia nacional y capacidad de
              atender proyectos en Latinoamérica.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

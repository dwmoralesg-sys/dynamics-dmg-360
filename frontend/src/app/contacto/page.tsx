import { QuoteForm } from '@/components/QuoteForm';

export const metadata = { title: 'Contacto · Dynamics DMG 360' };

export default function ContactoPage({ searchParams }: { searchParams: { servicio?: string } }) {
  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 48, alignItems: 'start' }} >
        <div>
          <span className="eyebrow">Contacto</span>
          <h1 style={{ fontSize: '2.2rem', marginTop: 16, marginBottom: 16 }}>Solicita tu cotización</h1>
          <p className="lead">
            Cuéntanos qué necesitas. Analizamos tu caso y te proponemos una solución 360°,
            del diagnóstico a la implementación.
          </p>

          <div className="card" style={{ marginTop: 26, padding: 22 }}>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Escríbenos directo</p>
            <div style={{ display: 'grid', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 14 }}>
              <a href="mailto:dwmoralesg@gmail.com" style={{ color: 'var(--teal-soft)' }}>✉ dwmoralesg@gmail.com</a>
              <a href="tel:+51985850698" style={{ color: 'var(--teal-soft)' }}>✆ +51 985 850 698</a>
              <a href="https://wa.me/51985850698" style={{ color: 'var(--gold-soft)' }}>WhatsApp · +51 985 850 698</a>
            </div>
          </div>

          <div style={{ marginTop: 22, display: 'grid', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)' }}>
            <span>→ Atención en todo el Perú y Latinoamérica</span>
            <span>→ Todas las industrias, sin barreras de fronteras</span>
          </div>
        </div>
        <QuoteForm servicioPreseleccionado={searchParams.servicio} />
      </div>
    </section>
  );
}

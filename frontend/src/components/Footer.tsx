import Link from 'next/link';
import { Logo } from './Logo';
import { VisitCounter } from './VisitCounter';

interface Contacto { email: string; telefono: string; whatsapp: string; }
const DEFAULT: Contacto = { email: 'dwmoralesg@gmail.com', telefono: '+51 985 850 698', whatsapp: 'https://wa.me/51985850698' };

export function Footer({ contacto = DEFAULT }: { contacto?: Contacto }) {
  const tel = contacto.telefono.replace(/\s+/g, '');
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 40, padding: '48px 0' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 320 }}>
          <Logo />
          <p style={{ color: 'var(--ink-mute)', marginTop: 14, fontSize: 14 }}>
            Soluciones integrales en negocio, procesos y tecnología. Empresa peruana con alcance
            internacional, sin barreras de fronteras.
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold)', marginTop: 14 }}>
            Innovamos, conectamos, transformamos.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Navegación</p>
            <div style={{ display: 'grid', gap: 9, fontSize: 14, color: 'var(--ink-soft)' }}>
              <Link href="/servicios">Servicios</Link>
              <Link href="/portafolio">Portafolio</Link>
              <Link href="/nosotros">Nosotros</Link>
              <Link href="/contacto">Contacto</Link>
              <Link href="/admin/login">Panel administrativo</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Contacto</p>
            <div style={{ display: 'grid', gap: 9, fontSize: 14, color: 'var(--ink-soft)' }}>
              <a href={`mailto:${contacto.email}`}>{contacto.email}</a>
              <a href={`tel:${tel}`}>{contacto.telefono}</a>
              <a href={contacto.whatsapp} style={{ color: 'var(--teal-soft)' }}>WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>
        <span>© {new Date().getFullYear()} Dynamics DMG 360 · Perú · Todas las industrias</span>
        <VisitCounter />
      </div>
    </footer>
  );
}

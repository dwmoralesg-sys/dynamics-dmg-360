import Link from 'next/link';
import { Logo } from './Logo';

const nav = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/portafolio', label: 'Portafolio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid var(--line)',
        background: 'rgba(11,16,38,0.72)', backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}
      >
        <Link href="/" aria-label="Inicio"><Logo /></Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          {nav.map((n) => (
            <Link key={n.href} href={n.href}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)' }}>
              {n.label}
            </Link>
          ))}
          <Link href="/contacto" className="btn btn-primary">Cotizar</Link>
        </nav>
      </div>
    </header>
  );
}

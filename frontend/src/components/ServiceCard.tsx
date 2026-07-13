import Link from 'next/link';
import { areaMeta } from '@/lib/areas';
import type { Servicio } from '@/lib/api';

export function ServiceCard({ s }: { s: Servicio }) {
  const meta = areaMeta(s.area);
  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span className="chip" data-area={meta.tag} style={{ alignSelf: 'flex-start' }}>{meta.label}</span>
      <h3 style={{ fontSize: '1.15rem' }}>{s.titulo}</h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: 15, flexGrow: 1 }}>{s.resumen}</p>
      <Link href={`/contacto?servicio=${s.slug}`}
        style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--teal)' }}>
        Solicitar →
      </Link>
    </article>
  );
}

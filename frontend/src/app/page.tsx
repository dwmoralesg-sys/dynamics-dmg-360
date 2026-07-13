import Link from 'next/link';
import { OrbitHero } from '@/components/OrbitHero';
import { ServiceCard } from '@/components/ServiceCard';
import { api } from '@/lib/api';
import { SAMPLE_SERVICIOS } from '@/lib/sample';
import { IMG } from '@/lib/images';

async function getServicios() {
  try { return await api.servicios(); } catch { return SAMPLE_SERVICIOS; }
}

const perfiles = [
  { k: 'Negocio', t: 'Administración y Negocios Internacionales', d: 'Estrategia, gestión, costos, indicadores y comercio global.', c: 'var(--gold)' },
  { k: 'Procesos', t: 'Ingeniería Industrial', d: 'Lean, productividad, logística, Supply Chain y calidad.', c: 'var(--violet)' },
  { k: 'Software', t: 'Ingeniería de Sistemas', d: 'Desarrollo full stack, ERP, apps, APIs, IA y automatización.', c: 'var(--teal)' },
  { k: 'Soporte', t: 'Técnico en computación', d: 'Diagnóstico, mantenimiento, redes y soporte de equipos.', c: 'var(--ink)' },
];

const flujo = [
  { n: '01', k: 'Negocio', t: 'Entendemos tu negocio', d: 'Analizamos tu gestión, tu modelo y tus objetivos.', c: 'var(--gold)' },
  { n: '02', k: 'Procesos', t: 'Revisamos tus procesos', d: 'Detectamos cuellos de botella y oportunidades.', c: 'var(--violet)' },
  { n: '03', k: 'Tecnología', t: 'Implementamos la solución', d: 'Construimos e integramos la tecnología a medida.', c: 'var(--teal)' },
];

export default async function Home() {
  const servicios = await getServicios();
  const destacados = servicios.filter((s) => s.destacado).slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="section" style={{ paddingTop: 76, paddingBottom: 70 }}>
        <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 46, alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Innovamos · conectamos · transformamos</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5.2vw, 3.9rem)', marginTop: 20 }}>
              Ingeniería, negocio y <span className="gradient-text">tecnología 360°</span> sin fronteras
            </h1>
            <p className="lead" style={{ marginTop: 22 }}>
              Un solo aliado para digitalizar, automatizar y optimizar tu operación:
              desde la estrategia de negocio y la mejora de procesos hasta el desarrollo
              full stack y la robótica logística.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
              <Link href="/contacto" className="btn btn-primary">Solicitar cotización</Link>
              <Link href="/servicios" className="btn btn-ghost">Ver servicios</Link>
            </div>
            <div style={{ marginTop: 26, display: 'flex', gap: 22, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)' }}>
              <a href="mailto:dwmoralesg@gmail.com" style={{ color: 'var(--teal-soft)' }}>✉ dwmoralesg@gmail.com</a>
              <a href="tel:+51985850698" style={{ color: 'var(--teal-soft)' }}>✆ +51 985 850 698</a>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="frame floaty" style={{ aspectRatio: '4/5', boxShadow: 'var(--glow-teal)' }}>
              <span className="tick tl" /><span className="tick br" />
              <img src={IMG.almacen} alt="Centro de distribución con operaciones logísticas" />
              <span className="cap">Centro de distribución · logística inteligente</span>
            </div>
            <div style={{ position: 'absolute', right: -18, bottom: -18, width: 180, background: 'rgba(7,11,31,.6)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', backdropFilter: 'blur(8px)', padding: 8 }}>
              <OrbitHero />
            </div>
          </div>
        </div>
      </section>

      {/* PERFIL INTEGRAL */}
      <section className="section-tight">
        <div className="container">
          <span className="eyebrow">Perfil integral</span>
          <h2 style={{ fontSize: '1.9rem', marginTop: 14, marginBottom: 8 }}>Cuatro disciplinas, un solo aliado</h2>
          <p className="lead" style={{ marginBottom: 30 }}>
            Reunimos en un mismo equipo el conocimiento de un Licenciado en Administración y
            Negocios Internacionales, un Ingeniero Industrial, un Ingeniero de Sistemas y un
            Técnico en computación. Atendemos <strong style={{ color: 'var(--ink)' }}>todas las industrias, sin barreras de fronteras.</strong>
          </p>
          <div className="grid grid-4">
            {perfiles.map((p) => (
              <div key={p.t} className="card">
                <span className="chip" style={{ color: p.c, borderColor: p.c }}>{p.k}</span>
                <h3 style={{ fontSize: '1.05rem', margin: '14px 0 8px' }}>{p.t}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLUJO */}
      <section className="section-tight">
        <div className="container">
          <span className="eyebrow">Cómo trabajamos</span>
          <h2 style={{ fontSize: '1.9rem', marginTop: 14, marginBottom: 30 }}>De un problema empresarial a una solución implementada</h2>
          <div className="grid grid-3">
            {flujo.map((f) => (
              <div key={f.n} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: f.c }}>{f.n}</span>
                  <span className="chip" style={{ color: f.c, borderColor: f.c }}>{f.k}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 10 }}>{f.t}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANDA DE IMÁGENES */}
      <section className="section-tight">
        <div className="container">
          <span className="eyebrow">Tecnología en operación</span>
          <h2 style={{ fontSize: '1.9rem', marginTop: 14, marginBottom: 30 }}>Automatización, robótica y logística global</h2>
          <div className="grid grid-2">
            <div className="frame" style={{ aspectRatio: '16/10' }}>
              <span className="tick tl" /><span className="tick br" />
              <img src={IMG.robotica} alt="Brazo robótico en línea de producción automatizada" />
              <span className="cap">Automatización y robótica industrial</span>
            </div>
            <div className="frame" style={{ aspectRatio: '16/10' }}>
              <span className="tick tl" /><span className="tick br" />
              <img src={IMG.comercio} alt="Contenedores de comercio internacional" />
              <span className="cap">Comercio internacional · sin fronteras</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 30, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="eyebrow">Servicios</span>
              <h2 style={{ fontSize: '1.9rem', marginTop: 14 }}>Lo que podemos resolver</h2>
            </div>
            <Link href="/servicios" className="btn btn-ghost">Ver todos</Link>
          </div>
          <div className="grid grid-3">
            {destacados.map((s) => <ServiceCard key={s.id} s={s} />)}
          </div>
        </div>
      </section>

      {/* CTA CONTACTO */}
      <section className="section-tight">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '56px 26px', borderColor: 'var(--gold)', boxShadow: 'var(--glow-gold)' }}>
            <h2 style={{ fontSize: '2rem' }}>¿Tienes un reto en tu empresa?</h2>
            <p className="lead" style={{ margin: '16px auto 26px' }}>Del análisis a la implementación: te proponemos una solución 360° a la medida.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contacto" className="btn btn-primary">Conversemos</Link>
              <a href="https://wa.me/51985850698" className="btn btn-ghost">WhatsApp +51 985 850 698</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

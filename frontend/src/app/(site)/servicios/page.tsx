import { ServiceCard } from '@/components/ServiceCard';
import { api } from '@/lib/api';
import { AREAS } from '@/lib/areas';
import { SAMPLE_SERVICIOS } from '@/lib/sample';

export const metadata = { title: 'Servicios · Dynamics DMG 360' };

async function getServicios() {
  try { return await api.servicios(); } catch { return SAMPLE_SERVICIOS; }
}

export default async function ServiciosPage() {
  const servicios = await getServicios();
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Servicios</span>
        <h1 style={{ fontSize: '2.4rem', marginTop: 16, marginBottom: 12 }}>
          Un portafolio 360° para tu organización
        </h1>
        <p className="lead" style={{ marginBottom: 44 }}>
          Cubrimos administración y negocios, ingeniería industrial, ingeniería de sistemas,
          servicio técnico y consultoría en transformación digital.
        </p>

        {Object.entries(AREAS).map(([key, meta]) => {
          const items = servicios.filter((s) => s.area === key);
          if (items.length === 0) return null;
          return (
            <div key={key} style={{ marginBottom: 52 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.35rem' }}>{meta.label}</h2>
                <span className="chip" data-area={meta.tag}>{items.length} servicios</span>
              </div>
              <div className="grid grid-3">
                {items.map((s) => <ServiceCard key={s.id} s={s} />)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

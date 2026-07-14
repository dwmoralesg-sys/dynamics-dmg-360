import { api } from './api';

const CONTACTO_FALLBACK = {
  email: 'dwmoralesg@gmail.com',
  telefono: '+51 985 850 698',
  whatsapp: 'https://wa.me/51985850698',
};

// Datos de contacto editables desde el panel (grupo "contacto"), con respaldo.
export async function getContacto() {
  try {
    const c = await api.contenido('contacto');
    return {
      email: c['contacto.email'] || CONTACTO_FALLBACK.email,
      telefono: c['contacto.telefono'] || CONTACTO_FALLBACK.telefono,
      whatsapp: c['contacto.whatsapp'] || CONTACTO_FALLBACK.whatsapp,
    };
  } catch { return CONTACTO_FALLBACK; }
}

// Devuelve un grupo de contenido como objeto, con respaldo si la API falla.
export async function getGrupo(grupo: string): Promise<Record<string, string>> {
  try { return await api.contenido(grupo); } catch { return {}; }
}

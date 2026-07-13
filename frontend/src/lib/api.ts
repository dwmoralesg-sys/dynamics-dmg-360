// Cliente ligero para la API de Dynamics DMG 360.
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type Options = RequestInit & { token?: string };

async function request<T>(path: string, opts: Options = {}): Promise<T> {
  const { token, headers, ...rest } = opts;
  const res = await fetch(`${API}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
  return res.json();
}

export interface Servicio {
  id: string; slug: string; titulo: string; resumen: string;
  descripcion: string; area: string; icono?: string; destacado: boolean;
}
export interface Proyecto {
  id: string; slug: string; titulo: string; cliente?: string;
  resumen: string; descripcion: string; area: string; resultados?: string;
}

export const api = {
  servicios: (area?: string) =>
    request<Servicio[]>(`/servicios${area ? `?area=${area}` : ''}`),
  proyectos: () => request<Proyecto[]>(`/proyectos`),
  contenido: (grupo: string) => request<Record<string, string>>(`/contenido/grupo/${grupo}`),
  crearLead: (data: unknown) =>
    request<{ id: string }>(`/leads`, { method: 'POST', body: JSON.stringify(data) }),
  track: (data: unknown) =>
    request(`/analytics/track`, { method: 'POST', body: JSON.stringify(data) }).catch(() => {}),
  login: (email: string, password: string) =>
    request<{ accessToken: string; usuario: any }>(`/auth/login`, {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),
  resumen: (token: string) => request<any>(`/analytics/resumen`, { token }),
  leadsAdmin: (token: string) => request<any[]>(`/leads`, { token }),
};

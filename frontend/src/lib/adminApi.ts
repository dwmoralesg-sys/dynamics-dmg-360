import { auth } from './auth';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = auth.token();
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers || {}),
      },
      cache: 'no-store',
    });
  } catch {
    throw new Error('No pudimos conectar con el servidor. Intenta nuevamente en unos segundos.');
  }
  if (res.status === 401) {
    auth.clear();
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    throw new Error('Sesión expirada.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = Array.isArray(body.message) ? body.message.join(' ') : body.message;
    throw new Error(msg || `Error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

const get = <T>(p: string) => req<T>(p);
const post = <T>(p: string, body: unknown) => req<T>(p, { method: 'POST', body: JSON.stringify(body) });
const patch = <T>(p: string, body: unknown) => req<T>(p, { method: 'PATCH', body: JSON.stringify(body) });
const put = <T>(p: string, body: unknown) => req<T>(p, { method: 'PUT', body: JSON.stringify(body) });
const del = <T>(p: string) => req<T>(p, { method: 'DELETE' });

export const adminApi = {
  me: () => get<any>('/auth/me'),
  changePassword: (actual: string, nueva: string) => post('/auth/change-password', { actual, nueva }),

  analytics: { resumen: () => get<any>('/analytics/resumen') },

  servicios: {
    list: () => get<any[]>('/servicios/admin/todos'),
    create: (dto: unknown) => post('/servicios', dto),
    update: (id: string, dto: unknown) => patch(`/servicios/${id}`, dto),
    remove: (id: string) => del(`/servicios/${id}`),
  },
  proyectos: {
    list: () => get<any[]>('/proyectos/admin/todos'),
    create: (dto: unknown) => post('/proyectos', dto),
    update: (id: string, dto: unknown) => patch(`/proyectos/${id}`, dto),
    remove: (id: string) => del(`/proyectos/${id}`),
  },
  leads: {
    list: (estado?: string) => get<any[]>(`/leads${estado ? `?estado=${estado}` : ''}`),
    get: (id: string) => get<any>(`/leads/${id}`),
    update: (id: string, dto: unknown) => patch(`/leads/${id}`, dto),
  },
  cotizaciones: {
    list: (estado?: string) => get<any[]>(`/cotizaciones${estado ? `?estado=${estado}` : ''}`),
    get: (id: string) => get<any>(`/cotizaciones/${id}`),
    create: (dto: unknown) => post('/cotizaciones', dto),
    update: (id: string, dto: unknown) => patch(`/cotizaciones/${id}`, dto),
  },
  contenido: {
    list: () => get<any[]>('/contenido/admin/todos'),
    upsert: (dto: unknown) => put('/contenido', dto),
  },
  usuarios: {
    list: () => get<any[]>('/usuarios'),
    create: (dto: unknown) => post('/usuarios', dto),
    update: (id: string, dto: unknown) => patch(`/usuarios/${id}`, dto),
    remove: (id: string) => del(`/usuarios/${id}`),
  },
};

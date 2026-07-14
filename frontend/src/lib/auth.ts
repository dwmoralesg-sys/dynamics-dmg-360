// Manejo de sesión del panel (token + usuario) en sessionStorage.
export interface AdminUser { id: string; nombre: string; email: string; rol: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'; }

export const auth = {
  token(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('dmg_token');
  },
  user(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem('dmg_user');
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  },
  set(token: string, user: AdminUser) {
    sessionStorage.setItem('dmg_token', token);
    sessionStorage.setItem('dmg_user', JSON.stringify(user));
  },
  clear() {
    sessionStorage.removeItem('dmg_token');
    sessionStorage.removeItem('dmg_user');
  },
};

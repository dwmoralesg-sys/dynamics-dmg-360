'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true); setError('');
    try {
      const { accessToken, usuario } = await api.login(email, password);
      sessionStorage.setItem('dmg_token', accessToken);
      sessionStorage.setItem('dmg_user', JSON.stringify(usuario));
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="section" style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}><Logo size={34} /></div>
        <form onSubmit={submit} className="card">
          <p className="eyebrow" style={{ marginBottom: 18 }}>Panel administrativo</p>
          <div className="field">
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p style={{ color: '#ff8f8f', fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={cargando}>
            {cargando ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </section>
  );
}

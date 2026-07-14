'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Boxes, FolderKanban, Users2, FileText, Receipt,
  BarChart3, UserCog, LogOut, KeyRound, Globe,
} from 'lucide-react';
import { auth, AdminUser } from '@/lib/auth';
import { Logo } from '@/components/Logo';

const nav = [
  { group: 'General', items: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/analitica', label: 'Analítica', icon: BarChart3 },
  ]},
  { group: 'Comercial', items: [
    { href: '/admin/leads', label: 'Clientes potenciales', icon: Users2 },
    { href: '/admin/cotizaciones', label: 'Cotizaciones', icon: Receipt },
  ]},
  { group: 'Contenido web', items: [
    { href: '/admin/servicios', label: 'Servicios', icon: Boxes },
    { href: '/admin/proyectos', label: 'Portafolio', icon: FolderKanban },
    { href: '/admin/contenido', label: 'Textos e imágenes', icon: FileText },
  ]},
  { group: 'Sistema', items: [
    { href: '/admin/usuarios', label: 'Usuarios', icon: UserCog, superOnly: true },
    { href: '/admin/cuenta', label: 'Mi cuenta', icon: KeyRound },
  ]},
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) { setReady(true); return; }
    const u = auth.user();
    if (!auth.token() || !u) { router.replace('/admin/login'); return; }
    setUser(u);
    setReady(true);
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;
  if (!ready || !user) return null;

  function salir() { auth.clear(); router.replace('/admin/login'); }
  const initials = user.nombre.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="admin">
      <aside className="a-sidebar">
        <Link href="/admin/dashboard"><Logo size={26} /></Link>
        <nav className="a-nav">
          {nav.map((g) => {
            const items = g.items.filter((i: any) => !i.superOnly || user.rol === 'SUPER_ADMIN');
            if (items.length === 0) return null;
            return (
              <React.Fragment key={g.group}>
                <span className="a-nav-group">{g.group}</span>
                {items.map((i) => {
                  const Icon = i.icon;
                  const active = pathname === i.href;
                  return (
                    <Link key={i.href} href={i.href} className={active ? 'active' : ''}>
                      <Icon size={17} /> {i.label}
                    </Link>
                  );
                })}
              </React.Fragment>
            );
          })}
          <span className="a-nav-group">Sitio</span>
          <Link href="/" target="_blank"><Globe size={17} /> Ver web pública</Link>
        </nav>
      </aside>

      <div className="a-main">
        <header className="a-topbar">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)', letterSpacing: '.1em' }}>
            PANEL ADMINISTRATIVO
          </span>
          <div className="a-user">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14 }}>{user.nombre}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)' }}>{user.rol}</div>
            </div>
            <div className="a-avatar">{initials}</div>
            <button className="a-iconbtn" onClick={salir} aria-label="Cerrar sesión" title="Cerrar sesión"><LogOut size={16} /></button>
          </div>
        </header>
        <div className="a-content">{children}</div>
      </div>
    </div>
  );
}

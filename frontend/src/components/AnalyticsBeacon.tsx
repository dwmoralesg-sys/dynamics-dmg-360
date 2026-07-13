'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

// Registra una visita anónima al cambiar de ruta.
// No recopila datos que identifiquen personalmente al visitante.
function sessionId(): string {
  try {
    let id = localStorage.getItem('dmg_sid');
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('dmg_sid', id); }
    return id;
  } catch { return 'anon'; }
}

export function AnalyticsBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    api.track({
      path: pathname,
      referer: document.referrer || undefined,
      fuente: params.get('utm_source') || undefined,
      campana: params.get('utm_campaign') || undefined,
      sessionId: sessionId(),
    });
  }, [pathname]);
  return null;
}

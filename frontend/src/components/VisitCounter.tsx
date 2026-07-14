'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function VisitCounter() {
  const [data, setData] = useState<{ total: number; visitantes: number } | null>(null);
  useEffect(() => { api.contador().then(setData).catch(() => {}); }, []);
  if (!data) return null;
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-mute)' }}>
      ● {data.total.toLocaleString('es-PE')} visitas · {data.visitantes.toLocaleString('es-PE')} visitantes
    </span>
  );
}

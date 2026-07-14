// Etiquetas y estilos de estados para el panel.
export const AREAS_OPCIONES = [
  { v: 'ADMINISTRACION_NEGOCIOS', l: 'Administración y Negocios' },
  { v: 'INGENIERIA_INDUSTRIAL', l: 'Ingeniería Industrial' },
  { v: 'INGENIERIA_SISTEMAS', l: 'Ingeniería de Sistemas' },
  { v: 'SERVICIO_TECNICO', l: 'Servicio Técnico' },
  { v: 'CONSULTORIA', l: 'Consultoría' },
];

export const ESTADO_LEAD = ['NUEVO', 'CONTACTADO', 'EN_PROCESO', 'GANADO', 'PERDIDO'] as const;
export const ESTADO_COTIZACION = ['SOLICITADA', 'EN_ELABORACION', 'ENVIADA', 'ACEPTADA', 'RECHAZADA'] as const;
export const ESTADO_PROYECTO = ['PLANIFICADO', 'EN_CURSO', 'FINALIZADO'] as const;
export const ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as const;

export function badgeClass(estado: string): string {
  if (['GANADO', 'ACEPTADA', 'FINALIZADO'].includes(estado)) return 'a-badge ok';
  if (['PERDIDO', 'RECHAZADA'].includes(estado)) return 'a-badge bad';
  if (['NUEVO', 'SOLICITADA', 'PLANIFICADO'].includes(estado)) return 'a-badge warn';
  if (['EN_PROCESO', 'EN_ELABORACION', 'EN_CURSO', 'CONTACTADO', 'ENVIADA'].includes(estado)) return 'a-badge info';
  return 'a-badge';
}

export function labelEstado(e: string) { return e.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase()); }
export function areaLabel(a?: string) { return AREAS_OPCIONES.find((x) => x.v === a)?.l ?? (a || '—'); }

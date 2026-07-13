// Metadatos de las áreas de servicio: etiqueta legible + código de color.
export const AREAS = {
  ADMINISTRACION_NEGOCIOS: { label: 'Administración y Negocios', tag: 'negocio' },
  INGENIERIA_INDUSTRIAL: { label: 'Ingeniería Industrial', tag: 'industrial' },
  INGENIERIA_SISTEMAS: { label: 'Ingeniería de Sistemas', tag: 'sistemas' },
  SERVICIO_TECNICO: { label: 'Servicio Técnico', tag: 'tecnico' },
  CONSULTORIA: { label: 'Consultoría', tag: 'consultoria' },
} as const;

export type AreaKey = keyof typeof AREAS;

export function areaMeta(area: string) {
  return (AREAS as Record<string, { label: string; tag: string }>)[area]
    ?? { label: area, tag: 'tecnico' };
}

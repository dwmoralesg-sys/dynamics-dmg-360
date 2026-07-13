import type { Servicio, Proyecto } from './api';

// Datos de respaldo para que la web renderice aunque la API no esté activa.
export const SAMPLE_SERVICIOS: Servicio[] = [
  { id: '1', slug: 'desarrollo-fullstack', titulo: 'Desarrollador Full Stack / Programador', resumen: 'Webs, sistemas, APIs y apps de punta a punta: frontend, backend, base de datos y despliegue.', descripcion: '', area: 'INGENIERIA_SISTEMAS', destacado: true },
  { id: '2', slug: 'desarrollo-web-sistemas', titulo: 'Desarrollo web y sistemas empresariales', resumen: 'Sistemas a medida, ERP e integraciones para digitalizar tu operación.', descripcion: '', area: 'INGENIERIA_SISTEMAS', destacado: true },
  { id: '3', slug: 'apps-moviles', titulo: 'Aplicaciones móviles Android e iOS', resumen: 'Apps nativas y multiplataforma conectadas a tu negocio.', descripcion: '', area: 'INGENIERIA_SISTEMAS', destacado: false },
  { id: '4', slug: 'mejora-continua-lean', titulo: 'Mejora continua y Lean', resumen: 'Optimizamos procesos y productividad con metodologías Lean y KPI.', descripcion: '', area: 'INGENIERIA_INDUSTRIAL', destacado: true },
  { id: '5', slug: 'logistica-supply-chain', titulo: 'Logística y Supply Chain', resumen: 'Almacenes, distribución, inventarios y cadena de suministro optimizada.', descripcion: '', area: 'INGENIERIA_INDUSTRIAL', destacado: true },
  { id: '6', slug: 'automatizacion-procesos', titulo: 'Automatización y digitalización de procesos', resumen: 'Eliminamos tareas manuales integrando sistemas y flujos automáticos.', descripcion: '', area: 'INGENIERIA_INDUSTRIAL', destacado: false },
  { id: '7', slug: 'planeamiento-estrategico', titulo: 'Planeamiento estratégico y modelos de negocio', resumen: 'Estrategia, indicadores y organización para ordenar tu crecimiento.', descripcion: '', area: 'ADMINISTRACION_NEGOCIOS', destacado: true },
  { id: '8', slug: 'comercio-internacional', titulo: 'Comercio internacional y negocios globales', resumen: 'Importación, exportación y expansión sin barreras de fronteras.', descripcion: '', area: 'ADMINISTRACION_NEGOCIOS', destacado: false },
  { id: '9', slug: 'soporte-tecnico', titulo: 'Servicio técnico y soporte tecnológico', resumen: 'Diagnóstico, mantenimiento, redes y configuración de equipos.', descripcion: '', area: 'SERVICIO_TECNICO', destacado: false },
  { id: '10', slug: 'transformacion-digital', titulo: 'Transformación digital y consultoría', resumen: 'Del diagnóstico a la implementación tecnológica, con IA donde suma.', descripcion: '', area: 'CONSULTORIA', destacado: true },
];

export const SAMPLE_PROYECTOS: Proyecto[] = [
  { id: '1', slug: 'digitalizacion-pyme-industrial', titulo: 'Digitalización de un centro de distribución', cliente: 'Confidencial', resumen: 'Del papel a un sistema web con control de inventario en tiempo real.', descripcion: '', area: 'INGENIERIA_INDUSTRIAL', resultados: 'Reducción de 30% en tiempos de registro y trazabilidad total del stock.' },
];

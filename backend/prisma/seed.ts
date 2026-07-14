import { PrismaClient, AreaServicio } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ---------------- Usuario administrador inicial ----------------
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@dynamicsdmg360.com').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin.360Seguro';
  const nombre = process.env.SEED_ADMIN_NOMBRE ?? 'Administrador DMG';

  const passwordHash = await bcrypt.hash(password, 12);
  const resetAdminPassword = process.env.SEED_ADMIN_RESET_PASSWORD === 'true';
  await prisma.usuario.upsert({
    where: { email },
    update: resetAdminPassword ? { nombre, passwordHash } : { nombre },
    create: { nombre, email, passwordHash, rol: 'SUPER_ADMIN' },
  });
  console.log(`✓ Usuario admin: ${email}`);

  // ---------------- Servicios de ejemplo ----------------
  const servicios: {
    slug: string; titulo: string; resumen: string; descripcion: string;
    area: AreaServicio; icono: string; destacado: boolean; orden: number;
  }[] = [
    {
      slug: 'desarrollo-fullstack',
      titulo: 'Desarrollador Full Stack / Programador',
      resumen: 'Desarrollo de punta a punta: frontend, backend, base de datos, APIs y despliegue.',
      descripcion:
        'Construyo soluciones completas: interfaces web (React/Next.js), servidores y APIs (Node/NestJS), bases de datos (PostgreSQL), integraciones, automatizaciones y despliegue en la nube. Un solo responsable para todo el ciclo del software.',
      area: 'INGENIERIA_SISTEMAS', icono: 'code', destacado: true, orden: 0,
    },
    {
      slug: 'comercio-internacional',
      titulo: 'Comercio internacional y negocios globales',
      resumen: 'Importación, exportación y expansión de negocios sin barreras de fronteras.',
      descripcion:
        'Asesoría en comercio internacional, modelos de negocio globales, costos, indicadores y estrategia comercial para operar en múltiples mercados.',
      area: 'ADMINISTRACION_NEGOCIOS', icono: 'globe', destacado: false, orden: 8,
    },
    {
      slug: 'planeamiento-estrategico',
      titulo: 'Planeamiento estratégico y modelos de negocio',
      resumen: 'Diseñamos la estrategia y el modelo de negocio que ordena tu crecimiento.',
      descripcion:
        'Analizamos tu organización, definimos objetivos, indicadores y un plan de acción claro. Incluye análisis empresarial, estructura organizacional, costos e indicadores de gestión.',
      area: 'ADMINISTRACION_NEGOCIOS', icono: 'target', destacado: true, orden: 1,
    },
    {
      slug: 'mejora-continua-lean',
      titulo: 'Mejora continua y Lean',
      resumen: 'Optimizamos procesos y productividad con metodologías Lean.',
      descripcion:
        'Mapeamos procesos, eliminamos desperdicios y elevamos la productividad. Trabajamos KPI, calidad, mantenimiento y estandarización para operaciones más eficientes.',
      area: 'INGENIERIA_INDUSTRIAL', icono: 'trending-up', destacado: true, orden: 2,
    },
    {
      slug: 'logistica-supply-chain',
      titulo: 'Logística y Supply Chain',
      resumen: 'Gestión de almacenes, distribución y cadena de suministro.',
      descripcion:
        'Rediseñamos la cadena de suministro: almacenes, inventarios, distribución y costos logísticos, con foco en nivel de servicio y reducción de costos.',
      area: 'INGENIERIA_INDUSTRIAL', icono: 'truck', destacado: false, orden: 3,
    },
    {
      slug: 'desarrollo-web-sistemas',
      titulo: 'Desarrollo web y sistemas empresariales',
      resumen: 'Webs, sistemas a medida, ERP e integraciones.',
      descripcion:
        'Construimos plataformas web, sistemas empresariales y ERP a medida, con APIs, integraciones y bases de datos robustas para digitalizar tu operación.',
      area: 'INGENIERIA_SISTEMAS', icono: 'code', destacado: true, orden: 4,
    },
    {
      slug: 'apps-moviles',
      titulo: 'Aplicaciones móviles Android e iOS',
      resumen: 'Apps nativas y multiplataforma conectadas a tu negocio.',
      descripcion:
        'Diseñamos y desarrollamos aplicaciones móviles para Android e iOS integradas con tus sistemas y procesos.',
      area: 'INGENIERIA_SISTEMAS', icono: 'smartphone', destacado: false, orden: 5,
    },
    {
      slug: 'soporte-tecnico',
      titulo: 'Servicio técnico y soporte tecnológico',
      resumen: 'Diagnóstico, mantenimiento, redes y configuración de equipos.',
      descripcion:
        'Soporte integral para computadoras, laptops y dispositivos: diagnóstico, mantenimiento, instalación de software, configuración y redes.',
      area: 'SERVICIO_TECNICO', icono: 'wrench', destacado: false, orden: 6,
    },
    {
      slug: 'transformacion-digital',
      titulo: 'Transformación digital y automatización',
      resumen: 'Digitalizamos y automatizamos procesos de punta a punta.',
      descripcion:
        'Acompañamos tu transformación digital: automatización de procesos, integración de sistemas, analítica e incorporación de IA donde genera valor.',
      area: 'CONSULTORIA', icono: 'zap', destacado: true, orden: 7,
    },
  ];

  for (const s of servicios) {
    await prisma.servicio.upsert({ where: { slug: s.slug }, update: s, create: s });
  }
  console.log(`✓ ${servicios.length} servicios`);

  // ---------------- Proyecto de portafolio de ejemplo ----------------
  await prisma.proyecto.upsert({
    where: { slug: 'digitalizacion-pyme-industrial' },
    update: {},
    create: {
      slug: 'digitalizacion-pyme-industrial',
      titulo: 'Digitalización de una PYME industrial',
      cliente: 'Confidencial',
      resumen: 'Del papel a un sistema web con indicadores en tiempo real.',
      descripcion:
        'Rediseñamos los procesos de producción y almacén, e implementamos un sistema web para el registro y control con tableros de indicadores.',
      area: 'INGENIERIA_INDUSTRIAL',
      resultados: 'Reducción de 30% en tiempos de registro y visibilidad de inventario en tiempo real.',
      estado: 'FINALIZADO', destacado: true, orden: 1, publicado: true,
    },
  });
  console.log('✓ Proyecto de ejemplo');

  // ---------------- Contenido web editable (CMS) ----------------
  const contenido = [
    { clave: 'home.hero.eslogan', grupo: 'home', valor: 'Innovamos, conectamos, transformamos.' },
    { clave: 'home.hero.titulo', grupo: 'home', valor: 'Soluciones 360° en negocio, procesos y tecnología' },
    { clave: 'home.hero.subtitulo', grupo: 'home', valor: 'Integramos administración, ingeniería industrial y tecnología para que tu organización sea más eficiente y competitiva.' },
    { clave: 'nosotros.mision', grupo: 'nosotros', valor: 'Brindar soluciones integrales en administración, ingeniería industrial y tecnología, ayudando a personas y organizaciones a optimizar sus procesos, modernizar sus operaciones e implementar soluciones innovadoras que generen eficiencia y crecimiento.' },
    { clave: 'nosotros.vision', grupo: 'nosotros', valor: 'Para 2031, consolidar a Dynamics DMG 360 como una empresa peruana reconocida en soluciones integrales de gestión, ingeniería y tecnología, con presencia nacional y capacidad de atender proyectos en Latinoamérica.' },
    { clave: 'contacto.email', grupo: 'contacto', valor: 'dwmoralesg@gmail.com' },
    { clave: 'contacto.telefono', grupo: 'contacto', valor: '+51 985 850 698' },
    { clave: 'contacto.whatsapp', grupo: 'contacto', valor: 'https://wa.me/51985850698' },
  ];
  for (const c of contenido) {
    await prisma.contenidoWeb.upsert({ where: { clave: c.clave }, update: { valor: c.valor }, create: c });
  }
  console.log(`✓ ${contenido.length} bloques de contenido`);

  console.log('\nSeed completado.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

# Estructura del proyecto — Dynamics DMG 360

Monorepo con dos aplicaciones (`backend` y `frontend`) más documentación.

```
dynamics-dmg-360/
├── README.md                     Guía de instalación y ejecución
├── docker-compose.yml            PostgreSQL + Adminer para desarrollo
├── .editorconfig / .gitignore
│
├── docs/
│   ├── ARQUITECTURA.md           Arquitectura técnica
│   ├── MODELO_DATOS.md           Modelo de datos y tablas
│   └── ESTRUCTURA.md             Este documento
│
├── backend/                      API — NestJS + Prisma
│   ├── package.json
│   ├── tsconfig.json · nest-cli.json
│   ├── .env.example              Variables (DB, JWT, seed)
│   ├── prisma/
│   │   ├── schema.prisma         TODAS las tablas y enums
│   │   └── seed.ts               Admin + datos de ejemplo
│   └── src/
│       ├── main.ts               Arranque (Helmet, CORS, validación)
│       ├── app.module.ts         Módulo raíz + guards globales
│       ├── prisma/               PrismaService (conexión)
│       ├── common/
│       │   ├── decorators/       @Public, @Roles, @CurrentUser
│       │   └── guards/           JwtAuthGuard, RolesGuard
│       └── modules/
│           ├── auth/             login, JWT strategy
│           ├── users/            usuarios del panel
│           ├── servicios/        catálogo comercial
│           ├── leads/            captación de clientes
│           ├── cotizaciones/     solicitudes y presupuestos
│           ├── proyectos/        portafolio
│           ├── contenido/        CMS ligero
│           └── analytics/        visitas + resumen dashboard
│
└── frontend/                     Web — Next.js (App Router) + TS
    ├── package.json
    ├── next.config.js · tsconfig.json
    ├── .env.example              NEXT_PUBLIC_API_URL
    └── src/
        ├── app/
        │   ├── layout.tsx        Layout raíz + fuentes + chrome
        │   ├── globals.css       Sistema de diseño (tokens)
        │   ├── page.tsx          Inicio (hero orbital 360°)
        │   ├── servicios/        Catálogo por área
        │   ├── portafolio/       Proyectos
        │   ├── nosotros/         Misión y visión
        │   ├── contacto/         Formulario de cotización
        │   └── admin/
        │       ├── login/        Acceso al panel
        │       └── dashboard/    Métricas + leads
        ├── components/
        │   ├── Header · Footer · Logo
        │   ├── OrbitHero         Elemento visual distintivo
        │   ├── ServiceCard · QuoteForm
        │   └── AnalyticsBeacon   Registro de visitas (cliente)
        └── lib/
            ├── api.ts            Cliente de la API
            ├── areas.ts          Metadatos de áreas de servicio
            └── sample.ts         Datos de respaldo (web sin API)
```

## Convenciones

- **Un módulo por dominio** en el backend: cada carpeta agrupa su
  `controller`, `service`, `module` y `dto`.
- **Áreas de servicio** centralizadas en un solo enum (backend) y un solo
  mapa de metadatos (`frontend/src/lib/areas.ts`), para mantener consistencia
  de etiquetas y colores.
- **Contenido editable** vive en la tabla `contenido_web`; el objetivo es que
  textos e imágenes de la web se cambien desde el panel sin tocar código.
- **Secretos** (claves JWT, credenciales de BD, sal de analítica) solo en
  archivos `.env`, nunca versionados.

## Dónde tocar para tareas comunes

| Necesito… | Archivo(s) |
|-----------|-----------|
| Agregar un endpoint | `backend/src/modules/<dominio>/*.controller.ts` + `*.service.ts` |
| Cambiar una tabla | `backend/prisma/schema.prisma` → `npm run prisma:migrate` |
| Ajustar colores/tipografía | `frontend/src/app/globals.css` |
| Editar el hero | `frontend/src/components/OrbitHero.tsx` y `app/page.tsx` |
| Cambiar el cliente de API | `frontend/src/lib/api.ts` |
| Datos de ejemplo | `backend/prisma/seed.ts` |

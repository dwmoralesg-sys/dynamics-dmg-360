# Dynamics DMG 360

**Innovamos, conectamos, transformamos.**

## Publicación oficial

- Web: https://dynamics-dmg-360.vercel.app/
- Código fuente: https://github.com/dwmoralesg-sys/dynamics-dmg-360
- Propietario: Daniel Morales

Plataforma web empresarial y administrable para Dynamics DMG 360: presenta y comercializa servicios integrales de administración y negocios, ingeniería industrial, ingeniería de sistemas y servicio técnico; capta clientes potenciales, registra solicitudes de cotización y analiza el comportamiento de los visitantes respetando su privacidad.

Concepto central: **Negocio → Procesos → Tecnología.**

## Arquitectura

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Backend / API | NestJS 10 + Prisma |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT + bcrypt, con roles |
| Analítica | Registro de visitas con privacidad (IP hasheada, sin PII) |

Es un **monorepo** con dos aplicaciones independientes:

```
dynamics-dmg-360/
├── backend/     API NestJS + Prisma (puerto 4000)
├── frontend/    Web Next.js (puerto 3000)
├── docs/        Arquitectura, modelo de datos y estructura
└── docker-compose.yml   PostgreSQL + Adminer
```

## Requisitos

- Node.js 20 o superior
- Docker (o una instancia de PostgreSQL propia)

## Puesta en marcha (paso a paso)

### 1. Base de datos

```bash
docker compose up -d
# PostgreSQL queda en localhost:5432
# Adminer (explorador visual) en http://localhost:8080
```

Si prefieres tu propio PostgreSQL, crea una base `dynamics_dmg_360` y ajusta `DATABASE_URL`.

### 2. Backend (API)

```bash
cd backend
cp .env.example .env          # revisa y cambia las claves
npm install
npm run prisma:generate       # genera el cliente Prisma
npm run prisma:migrate        # crea las tablas (migración inicial)
npm run db:seed               # usuario admin + datos de ejemplo
npm run start:dev             # API en http://localhost:4000/api
```

Usuario administrador inicial (definido en `.env`):

- Correo: `admin@dynamicsdmg360.com`
- Contraseña: `Admin.360Seguro`

> Cambia estas credenciales antes de publicar.

### 3. Frontend (web)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                   # web en http://localhost:3000
```

La web pública funciona incluso sin la API (usa datos de respaldo), pero el
formulario de cotización, la analítica y el panel `/admin` requieren el backend.

## Rutas principales

**Web pública**

- `/` — inicio
- `/servicios` — catálogo por área
- `/portafolio` — proyectos
- `/nosotros` — misión y visión
- `/contacto` — solicitud de cotización

**Panel administrativo**

- `/admin/login`
- `/admin/dashboard` — métricas y clientes potenciales

**API (prefijo `/api`)**

- `POST /auth/login`
- `GET /servicios` · `GET /proyectos` · `GET /contenido/grupo/:grupo`
- `POST /leads` (captación) · `POST /analytics/track`
- `GET /leads`, `GET /cotizaciones`, `GET /analytics/resumen` (requieren token)

## Documentación

- [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md)
- [`docs/MODELO_DATOS.md`](docs/MODELO_DATOS.md)
- [`docs/ESTRUCTURA.md`](docs/ESTRUCTURA.md)

## Privacidad de la analítica

La analítica se diseñó para **no** identificar personalmente a un visitante anónimo:
no se guarda la IP en claro (solo un hash irreversible con sal), y se registran
únicamente datos técnicos agregados (página, dispositivo, navegador, país/ciudad
aproximados cuando el proxy los provee). Antes de publicar, añade tu aviso de
privacidad y el consentimiento de cookies según la normativa aplicable.

## Fase 2 (posterior)

CRM, integración con WhatsApp, pagos en línea, tickets de soporte, IA y
aplicaciones móviles, tal como se plantea en el documento de alcance.

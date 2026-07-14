# Dynamics DMG 360

**Innovamos, conectamos, transformamos.**

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

**Panel administrativo** (`/admin`)

- `/admin/login` — acceso
- `/admin/dashboard` — resumen de métricas y últimos leads
- `/admin/analitica` — visitas por país, ciudad, dispositivo, navegador, SO, páginas y línea de tiempo
- `/admin/leads` — clientes potenciales: detalle, cambio de estado y generación de cotización
- `/admin/cotizaciones` — seguimiento comercial (estado, monto, items)
- `/admin/servicios` — CRUD del catálogo (crear, editar, activar, destacar, ordenar, eliminar)
- `/admin/proyectos` — CRUD del portafolio
- `/admin/contenido` — editar textos, imágenes y datos de contacto sin tocar código
- `/admin/usuarios` — cuentas y roles (solo SUPER_ADMIN)
- `/admin/cuenta` — perfil y cambio de contraseña

Todo lo que ve el cliente es administrable desde el panel: servicios, portafolio,
textos del inicio, misión/visión y datos de contacto (correo, teléfono, WhatsApp).

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

## Contacto y contador de visitas

- La web incluye un **botón flotante de WhatsApp**, enlaces `mailto:` y `tel:`,
  y el formulario de cotización que registra los leads en el panel.
- En el pie de página se muestra un **contador de visitas** (total y visitantes
  únicos aproximados), alimentado por el endpoint público `/analytics/contador`.
- Datos de contacto actuales: `dwmoralesg@gmail.com` · `+51 985 850 698`.
  Se editan desde `/admin/contenido` (grupo "contacto").

## Integraciones sugeridas (para más contacto y automatización)

Estas se pueden añadir en Fase 2 según prioridad:

- **WhatsApp Business API** (Meta Cloud API o Twilio) para responder y notificar
  automáticamente cada nuevo lead por WhatsApp.
- **Notificaciones por correo** al recibir un lead, con Resend, SendGrid o SMTP
  (basta con un hook en `LeadsService.create`).
- **Calendly / Cal.com** para que el cliente agende una reunión desde la web.
- **Messenger / Instagram** de Meta y un chat en vivo (Chatwoot, Crisp).
- **reCAPTCHA v3 o Turnstile** para proteger el formulario de spam.
- **Pasarela de pagos** (Culqi, Mercado Pago, Izipay o Stripe) para cobrar en línea.
- **Google Analytics 4 / Meta Pixel** como complemento a la analítica propia.
- **CRM** (HubSpot, Pipedrive) sincronizando los leads vía API.

## Fase 2 (posterior)

CRM, integración con WhatsApp, pagos en línea, tickets de soporte, IA y
aplicaciones móviles, tal como se plantea en el documento de alcance.

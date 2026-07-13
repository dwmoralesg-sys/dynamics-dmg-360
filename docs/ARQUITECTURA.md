# Arquitectura técnica — Dynamics DMG 360

## 1. Visión general

Dynamics DMG 360 es una plataforma web empresarial administrable, no un sitio
informativo estático. Se compone de dos aplicaciones desacopladas que se comunican
por una API REST:

```
   Navegador del cliente
          │
          ▼
   FRONTEND  (Next.js + TypeScript)        ← web pública + panel /admin
          │  fetch  (HTTP/JSON, prefijo /api)
          ▼
   BACKEND   (NestJS + Prisma)             ← lógica, autenticación, reglas
          │  Prisma Client
          ▼
   POSTGRESQL                              ← persistencia
```

Este desacople permite escalar y desplegar cada parte por separado, y facilita
una Fase 2 (apps móviles, integraciones) reutilizando la misma API.

## 2. Frontend

- **Next.js 14 (App Router)** con componentes de servidor para el contenido
  público (SEO y velocidad) y componentes de cliente para formularios y panel.
- **TypeScript** en todo el código.
- Sin framework de CSS pesado: un **sistema de diseño propio** en
  `globals.css` con tokens (color, tipografía, espaciado) para una identidad
  visual distintiva y controlada.
- **Baliza de analítica** (`AnalyticsBeacon`) que registra visitas anónimas al
  cambiar de ruta.

## 3. Backend

- **NestJS 10** organizado por módulos de dominio (auth, users, servicios,
  leads, cotizaciones, proyectos, contenido, analytics).
- **Prisma** como ORM y capa de acceso a datos.
- **Validación** de todas las entradas con `class-validator` (whitelist +
  rechazo de campos no permitidos).
- **Seguridad**: Helmet, CORS restringido al dominio del frontend, JWT global
  con guard, control de acceso por roles.

### Módulos

| Módulo | Responsabilidad | Público | Protegido |
|--------|-----------------|:------:|:---------:|
| auth | Login, emisión de JWT, `/me` | login | me |
| users | Gestión de usuarios del panel | — | SUPER_ADMIN |
| servicios | Catálogo comercial | lectura | escritura |
| leads | Captación de clientes potenciales | crear | leer/actualizar |
| cotizaciones | Solicitudes y presupuestos | — | sí |
| proyectos | Portafolio | lectura | escritura |
| contenido | CMS ligero (textos/imágenes) | lectura | escritura |
| analytics | Registro y resumen de visitas | track | resumen |

## 4. Autenticación y roles

- Contraseñas cifradas con **bcrypt** (nunca en claro).
- **JWT** firmado con `JWT_SECRET`; expira según `JWT_EXPIRES_IN`.
- Guard global `JwtAuthGuard`: todo requiere token salvo lo marcado `@Public()`.
- Guard `RolesGuard` + decorador `@Roles(...)`. Roles:
  - `SUPER_ADMIN` — control total, incluye gestión de usuarios.
  - `ADMIN` — gestión operativa (leads, cotizaciones, servicios, proyectos).
  - `EDITOR` — contenido y catálogo.

## 5. Analítica con privacidad

- No se almacena la IP en claro: se guarda un **hash SHA-256 con sal**
  (`ANALYTICS_IP_SALT`), irreversible.
- Solo datos técnicos: página, dispositivo, navegador, SO, fuente/campaña,
  país y ciudad aproximados si el CDN los aporta por cabeceras.
- No se intenta identificar personalmente a visitantes anónimos.
- Pendiente antes de producción: banner de consentimiento de cookies y aviso
  de privacidad conforme a la normativa aplicable.

## 6. Infraestructura y despliegue

**Desarrollo**: `docker-compose` levanta PostgreSQL + Adminer.

**Producción (sugerido, bajo costo inicial):**

- Frontend → Vercel (Next.js nativo).
- Backend → Railway / Render / Fly.io (contenedor Node).
- Base de datos → PostgreSQL gestionado (Railway, Neon, Supabase o RDS).
- HTTPS y dominio propio con DNS apuntando al frontend; la API en subdominio
  (p. ej. `api.dynamicsdmg360.com`).

Variables sensibles (`JWT_SECRET`, `DATABASE_URL`, sal de analítica) se
inyectan como variables de entorno del proveedor, nunca en el repositorio.

## 7. Escalabilidad y Fase 2

La API REST y el modelo de datos ya contemplan crecer hacia CRM, tickets de
soporte, pagos, WhatsApp e IA. Las apps móviles (Android/iOS) consumirían la
misma API sin cambios de arquitectura.

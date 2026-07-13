# Modelo de datos — Dynamics DMG 360

Base de datos: **PostgreSQL**. Definición formal en
[`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma).

## Diagrama lógico

```
 Usuario ──< AuditLog
    │
    └──< Cotizacion >── Lead
              │
              └──< CotizacionItem >── Servicio

 Proyecto        (independiente, portafolio público)
 ContenidoWeb    (CMS por clave)
 Visita          (analítica anónima)
```

`>──` y `──<` indican el lado "muchos" de la relación.

## Tablas

### usuarios
Cuentas del panel administrativo.

| Campo | Tipo | Notas |
|-------|------|------|
| id | uuid | PK |
| nombre | texto | |
| email | texto | único |
| passwordHash | texto | bcrypt, nunca en claro |
| rol | enum Rol | SUPER_ADMIN / ADMIN / EDITOR |
| activo | bool | baja lógica |
| ultimoAcceso | fecha | se actualiza al iniciar sesión |

### servicios
Catálogo comercial, administrable desde el panel.

| Campo | Tipo | Notas |
|-------|------|------|
| id | uuid | PK |
| slug | texto | único, para URLs |
| titulo, resumen, descripcion | texto | |
| area | enum AreaServicio | clasifica el servicio |
| icono, imagenUrl | texto | opcionales |
| precioReferencial | decimal | opcional |
| destacado, activo | bool | control de visibilidad |
| orden | int | ordenamiento manual |

### leads
Clientes potenciales captados por los formularios públicos.

| Campo | Tipo | Notas |
|-------|------|------|
| id | uuid | PK |
| nombre, email, mensaje | texto | requeridos |
| empresa, telefono, ciudad, pais | texto | opcionales |
| area | enum AreaServicio | opcional |
| origen | texto | fuente/campaña de captación |
| estado | enum EstadoLead | NUEVO → … → GANADO/PERDIDO |

### cotizaciones + cotizacion_items
Solicitudes y presupuestos asociados a un lead.

| cotizaciones | Tipo | Notas |
|-------|------|------|
| codigo | texto | único, p. ej. `COT-2026-0001` |
| leadId | uuid | FK → leads |
| estado | enum EstadoCotizacion | SOLICITADA → ENVIADA → ACEPTADA/RECHAZADA |
| montoEstimado | decimal | |
| asignadoAId | uuid | FK → usuarios (opcional) |

Cada `cotizacion_item` referencia opcionalmente un `servicio` con cantidad y
precio unitario.

### proyectos
Portafolio público.

| Campo | Tipo | Notas |
|-------|------|------|
| slug | texto | único |
| titulo, cliente, resumen, descripcion | texto | |
| area | enum AreaServicio | |
| resultados | texto | impacto obtenido |
| estado | enum EstadoProyecto | PLANIFICADO / EN_CURSO / FINALIZADO |
| destacado, publicado | bool | |

### contenido_web
CMS ligero: bloques editables por **clave** (p. ej. `home.hero.titulo`),
agrupados (`grupo`) y tipados (TEXTO / HTML / IMAGEN / JSON). Permite cambiar
textos e imágenes de la web sin tocar código.

### visitas
Analítica **anónima** y respetuosa de la privacidad.

| Campo | Tipo | Notas |
|-------|------|------|
| path, referer | texto | |
| fuente, campana | texto | utm_source / utm_campaign |
| pais, ciudad | texto | aproximados |
| dispositivo, navegador, so | texto | derivados del user-agent |
| ipHash | texto | **hash** irreversible, nunca la IP real |
| sessionId | texto | id anónimo de sesión |

### audit_logs
Trazabilidad de acciones administrativas (usuario, acción, entidad, fecha).

## Enums

- **Rol**: SUPER_ADMIN, ADMIN, EDITOR
- **AreaServicio**: ADMINISTRACION_NEGOCIOS, INGENIERIA_INDUSTRIAL,
  INGENIERIA_SISTEMAS, SERVICIO_TECNICO, CONSULTORIA
- **EstadoLead**: NUEVO, CONTACTADO, EN_PROCESO, GANADO, PERDIDO
- **EstadoCotizacion**: SOLICITADA, EN_ELABORACION, ENVIADA, ACEPTADA, RECHAZADA
- **EstadoProyecto**: PLANIFICADO, EN_CURSO, FINALIZADO
- **TipoContenido**: TEXTO, HTML, IMAGEN, JSON

## Índices relevantes

Se indexan `email` (usuarios), `area` y `activo/destacado` (servicios),
`estado` y `createdAt` (leads, cotizaciones), y `createdAt`/`path` (visitas)
para consultas y métricas eficientes.

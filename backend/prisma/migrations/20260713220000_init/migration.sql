-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "AreaServicio" AS ENUM ('ADMINISTRACION_NEGOCIOS', 'INGENIERIA_INDUSTRIAL', 'INGENIERIA_SISTEMAS', 'SERVICIO_TECNICO', 'CONSULTORIA');

-- CreateEnum
CREATE TYPE "EstadoLead" AS ENUM ('NUEVO', 'CONTACTADO', 'EN_PROCESO', 'GANADO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('SOLICITADA', 'EN_ELABORACION', 'ENVIADA', 'ACEPTADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "EstadoProyecto" AS ENUM ('PLANIFICADO', 'EN_CURSO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "TipoContenido" AS ENUM ('TEXTO', 'HTML', 'IMAGEN', 'JSON');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'EDITOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcceso" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "area" "AreaServicio" NOT NULL,
    "icono" TEXT,
    "imagenUrl" TEXT,
    "precioReferencial" DECIMAL(12,2),
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresa" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "ciudad" TEXT,
    "pais" TEXT DEFAULT 'Perú',
    "area" "AreaServicio",
    "mensaje" TEXT NOT NULL,
    "origen" TEXT,
    "estado" "EstadoLead" NOT NULL DEFAULT 'NUEVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizaciones" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "estado" "EstadoCotizacion" NOT NULL DEFAULT 'SOLICITADA',
    "notas" TEXT,
    "montoEstimado" DECIMAL(12,2),
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "asignadoAId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizacion_items" (
    "id" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "servicioId" TEXT,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitario" DECIMAL(12,2),

    CONSTRAINT "cotizacion_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "cliente" TEXT,
    "resumen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "area" "AreaServicio" NOT NULL,
    "imagenUrl" TEXT,
    "resultados" TEXT,
    "estado" "EstadoProyecto" NOT NULL DEFAULT 'FINALIZADO',
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenido_web" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "grupo" TEXT NOT NULL,
    "tipo" "TipoContenido" NOT NULL DEFAULT 'TEXTO',
    "valor" TEXT NOT NULL,
    "descripcion" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contenido_web_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitas" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referer" TEXT,
    "fuente" TEXT,
    "campana" TEXT,
    "pais" TEXT,
    "ciudad" TEXT,
    "dispositivo" TEXT,
    "navegador" TEXT,
    "so" TEXT,
    "ipHash" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "accion" TEXT NOT NULL,
    "entidad" TEXT,
    "entidadId" TEXT,
    "detalle" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "servicios_slug_key" ON "servicios"("slug");

-- CreateIndex
CREATE INDEX "servicios_area_idx" ON "servicios"("area");

-- CreateIndex
CREATE INDEX "servicios_activo_destacado_idx" ON "servicios"("activo", "destacado");

-- CreateIndex
CREATE INDEX "leads_estado_idx" ON "leads"("estado");

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "cotizaciones_codigo_key" ON "cotizaciones"("codigo");

-- CreateIndex
CREATE INDEX "cotizaciones_estado_idx" ON "cotizaciones"("estado");

-- CreateIndex
CREATE INDEX "cotizaciones_leadId_idx" ON "cotizaciones"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "proyectos_slug_key" ON "proyectos"("slug");

-- CreateIndex
CREATE INDEX "proyectos_publicado_destacado_idx" ON "proyectos"("publicado", "destacado");

-- CreateIndex
CREATE UNIQUE INDEX "contenido_web_clave_key" ON "contenido_web"("clave");

-- CreateIndex
CREATE INDEX "contenido_web_grupo_idx" ON "contenido_web"("grupo");

-- CreateIndex
CREATE INDEX "visitas_createdAt_idx" ON "visitas"("createdAt");

-- CreateIndex
CREATE INDEX "visitas_path_idx" ON "visitas"("path");

-- CreateIndex
CREATE INDEX "audit_logs_usuarioId_idx" ON "audit_logs"("usuarioId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_asignadoAId_fkey" FOREIGN KEY ("asignadoAId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_items" ADD CONSTRAINT "cotizacion_items_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion_items" ADD CONSTRAINT "cotizacion_items_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { TrackVisitaDto } from './dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Nunca se guarda la IP en claro: solo un hash irreversible con sal.
  private hashIp(ip?: string): string | null {
    if (!ip) return null;
    const salt = process.env.ANALYTICS_IP_SALT ?? 'sal-por-defecto';
    return createHash('sha256').update(salt + ip).digest('hex').slice(0, 32);
  }

  private detectar(ua = '') {
    const so = /Windows/i.test(ua) ? 'Windows'
      : /Mac OS/i.test(ua) ? 'macOS'
      : /Android/i.test(ua) ? 'Android'
      : /iPhone|iPad/i.test(ua) ? 'iOS'
      : /Linux/i.test(ua) ? 'Linux' : 'Otro';
    const navegador = /Edg/i.test(ua) ? 'Edge'
      : /Chrome/i.test(ua) ? 'Chrome'
      : /Firefox/i.test(ua) ? 'Firefox'
      : /Safari/i.test(ua) ? 'Safari' : 'Otro';
    const dispositivo = /Mobile/i.test(ua) ? 'mobile'
      : /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop';
    return { so, navegador, dispositivo };
  }

  async track(dto: TrackVisitaDto, meta: { ip?: string; ua?: string; pais?: string; ciudad?: string }) {
    const { so, navegador, dispositivo } = this.detectar(meta.ua);
    await this.prisma.visita.create({
      data: {
        path: dto.path,
        referer: dto.referer,
        fuente: dto.fuente,
        campana: dto.campana,
        sessionId: dto.sessionId,
        pais: meta.pais,
        ciudad: meta.ciudad,
        ipHash: this.hashIp(meta.ip),
        so, navegador, dispositivo,
      },
    });
    return { ok: true };
  }

  // Métricas agregadas para el dashboard.
  async resumen() {
    const desde = new Date();
    desde.setDate(desde.getDate() - 30);

    const [visitas30d, totalLeads, leadsNuevos, cotizaciones, serviciosActivos, topPaths, porDispositivo] =
      await Promise.all([
        this.prisma.visita.count({ where: { createdAt: { gte: desde } } }),
        this.prisma.lead.count(),
        this.prisma.lead.count({ where: { estado: 'NUEVO' } }),
        this.prisma.cotizacion.count(),
        this.prisma.servicio.count({ where: { activo: true } }),
        this.prisma.visita.groupBy({
          by: ['path'], _count: { path: true },
          orderBy: { _count: { path: 'desc' } }, take: 5,
          where: { createdAt: { gte: desde } },
        }),
        this.prisma.visita.groupBy({
          by: ['dispositivo'], _count: { dispositivo: true },
          where: { createdAt: { gte: desde } },
        }),
      ]);

    return {
      visitas30d, totalLeads, leadsNuevos, cotizaciones, serviciosActivos,
      topPaths: topPaths.map((p) => ({ path: p.path, visitas: p._count.path })),
      porDispositivo: porDispositivo.map((d) => ({ dispositivo: d.dispositivo, visitas: d._count.dispositivo })),
    };
  }
}

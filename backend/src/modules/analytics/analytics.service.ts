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
      : /OPR|Opera/i.test(ua) ? 'Opera'
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
        pais: meta.pais || null,
        ciudad: meta.ciudad || null,
        ipHash: this.hashIp(meta.ip),
        so, navegador, dispositivo,
      },
    });
    return { ok: true };
  }

  // Contador público de visitas totales (para mostrar en la web).
  async contador() {
    const [total, visitantes] = await Promise.all([
      this.prisma.visita.count(),
      this.prisma.visita.findMany({ distinct: ['sessionId'], select: { sessionId: true } }),
    ]);
    return { total, visitantes: visitantes.filter((v) => v.sessionId).length };
  }

  private async topGroup(campo: 'pais' | 'ciudad' | 'navegador' | 'so' | 'dispositivo' | 'fuente', desde: Date, take = 8) {
    const rows = await this.prisma.visita.groupBy({
      by: [campo] as any,
      _count: { [campo]: true } as any,
      where: { createdAt: { gte: desde }, NOT: { [campo]: null } as any },
      orderBy: { _count: { [campo]: 'desc' } as any },
      take,
    });
    return rows.map((r: any) => ({ valor: r[campo], visitas: r._count[campo] }));
  }

  // Serie de visitas por día (últimos N días).
  private async serieDiaria(dias = 14) {
    const desde = new Date();
    desde.setDate(desde.getDate() - (dias - 1));
    desde.setHours(0, 0, 0, 0);
    const visitas = await this.prisma.visita.findMany({
      where: { createdAt: { gte: desde } },
      select: { createdAt: true },
    });
    const mapa = new Map<string, number>();
    for (let i = 0; i < dias; i++) {
      const d = new Date(desde); d.setDate(desde.getDate() + i);
      mapa.set(d.toISOString().slice(0, 10), 0);
    }
    for (const v of visitas) {
      const k = v.createdAt.toISOString().slice(0, 10);
      if (mapa.has(k)) mapa.set(k, (mapa.get(k) || 0) + 1);
    }
    return Array.from(mapa.entries()).map(([dia, visitas]) => ({ dia, visitas }));
  }

  // Resumen completo para el dashboard de analítica.
  async resumen() {
    const d30 = new Date(); d30.setDate(d30.getDate() - 30);
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);

    const [
      totalVisitas, visitas30d, visitasHoy, totalLeads, leadsNuevos, cotizaciones, serviciosActivos,
      topPathsRaw, porPais, porCiudad, porNavegador, porSO, porDispositivo, porFuente, serie,
    ] = await Promise.all([
      this.prisma.visita.count(),
      this.prisma.visita.count({ where: { createdAt: { gte: d30 } } }),
      this.prisma.visita.count({ where: { createdAt: { gte: hoy } } }),
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { estado: 'NUEVO' } }),
      this.prisma.cotizacion.count(),
      this.prisma.servicio.count({ where: { activo: true } }),
      this.prisma.visita.groupBy({ by: ['path'], _count: { path: true }, orderBy: { _count: { path: 'desc' } }, take: 8, where: { createdAt: { gte: d30 } } }),
      this.topGroup('pais', d30),
      this.topGroup('ciudad', d30),
      this.topGroup('navegador', d30),
      this.topGroup('so', d30),
      this.topGroup('dispositivo', d30),
      this.topGroup('fuente', d30),
      this.serieDiaria(14),
    ]);

    return {
      totalVisitas, visitas30d, visitasHoy,
      totalLeads, leadsNuevos, cotizaciones, serviciosActivos,
      topPaths: topPathsRaw.map((p) => ({ path: p.path, visitas: p._count.path })),
      porPais, porCiudad, porNavegador, porSO, porDispositivo, porFuente, serie,
    };
  }
}

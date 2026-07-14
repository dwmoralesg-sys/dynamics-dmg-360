import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { TrackVisitaDto } from './dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Public() @Post('track')
  track(@Body() dto: TrackVisitaDto, @Req() req: Request) {
    const h = req.headers;
    // Geolocalización aproximada según el proxy/CDN (Vercel, Cloudflare, etc.)
    const pais = (h['x-vercel-ip-country'] || h['cf-ipcountry'] || h['x-country-code'] || undefined) as string | undefined;
    const ciudad = (h['x-vercel-ip-city'] || h['cf-ipcity'] || undefined) as string | undefined;
    return this.service.track(dto, {
      ip: (h['x-forwarded-for'] as string)?.split(',')[0] || req.ip,
      ua: h['user-agent'],
      pais: pais ? decodeURIComponent(pais) : undefined,
      ciudad: ciudad ? decodeURIComponent(ciudad) : undefined,
    });
  }

  @Public() @Get('contador')
  contador() { return this.service.contador(); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Get('resumen')
  resumen() { return this.service.resumen(); }
}

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
    // Encabezados de geolocalización aproximada si el proxy/CDN los provee.
    const pais = (req.headers['x-vercel-ip-country'] as string) || undefined;
    const ciudad = (req.headers['x-vercel-ip-city'] as string) || undefined;
    return this.service.track(dto, {
      ip: req.ip,
      ua: req.headers['user-agent'],
      pais,
      ciudad,
    });
  }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Get('resumen')
  resumen() { return this.service.resumen(); }
}

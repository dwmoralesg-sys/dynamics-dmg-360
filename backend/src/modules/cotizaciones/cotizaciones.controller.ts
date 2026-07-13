import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EstadoCotizacion } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateCotizacionDto, UpdateCotizacionDto } from './dto';
import { CotizacionesService } from './cotizaciones.service';

@Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR')
@Controller('cotizaciones')
export class CotizacionesController {
  constructor(private readonly service: CotizacionesService) {}

  @Post() create(@Body() dto: CreateCotizacionDto) { return this.service.create(dto); }
  @Get() findAll(@Query('estado') estado?: EstadoCotizacion) { return this.service.findAll(estado); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateCotizacionDto) { return this.service.update(id, dto); }
}

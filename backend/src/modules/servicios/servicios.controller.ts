import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AreaServicio } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateServicioDto, UpdateServicioDto } from './dto';
import { ServiciosService } from './servicios.service';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly service: ServiciosService) {}

  @Public() @Get()
  findPublic(@Query('area') area?: AreaServicio) { return this.service.findPublic(area); }

  @Public() @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Get('admin/todos')
  findAll() { return this.service.findAll(); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Post()
  create(@Body() dto: CreateServicioDto) { return this.service.create(dto); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServicioDto) { return this.service.update(id, dto); }

  @Roles('SUPER_ADMIN', 'ADMIN') @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}

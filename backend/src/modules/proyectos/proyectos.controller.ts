import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateProyectoDto, UpdateProyectoDto } from './dto';
import { ProyectosService } from './proyectos.service';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly service: ProyectosService) {}

  @Public() @Get() findPublic() { return this.service.findPublic(); }
  @Public() @Get('slug/:slug') findBySlug(@Param('slug') slug: string) { return this.service.findBySlug(slug); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Get('admin/todos') findAll() { return this.service.findAll(); }
  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Post() create(@Body() dto: CreateProyectoDto) { return this.service.create(dto); }
  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateProyectoDto) { return this.service.update(id, dto); }
  @Roles('SUPER_ADMIN', 'ADMIN') @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}

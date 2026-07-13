import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpsertContenidoDto } from './dto';
import { ContenidoService } from './contenido.service';

@Controller('contenido')
export class ContenidoController {
  constructor(private readonly service: ContenidoService) {}

  @Public() @Get('grupo/:grupo')
  porGrupo(@Param('grupo') grupo: string) { return this.service.porGrupo(grupo); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Get('admin/todos')
  findAll() { return this.service.findAll(); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Put()
  upsert(@Body() dto: UpsertContenidoDto) { return this.service.upsert(dto); }
}

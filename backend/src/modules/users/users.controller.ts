import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';
import { UsersService } from './users.service';

@Roles('SUPER_ADMIN')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() dto: CreateUsuarioDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}

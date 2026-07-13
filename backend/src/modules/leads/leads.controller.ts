import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { EstadoLead } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateLeadDto, UpdateLeadDto } from './dto';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  @Public() @Post()
  create(@Body() dto: CreateLeadDto) { return this.service.create(dto); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Get()
  findAll(@Query('estado') estado?: EstadoLead) { return this.service.findAll(estado); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Roles('SUPER_ADMIN', 'ADMIN', 'EDITOR') @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto) { return this.service.update(id, dto); }
}

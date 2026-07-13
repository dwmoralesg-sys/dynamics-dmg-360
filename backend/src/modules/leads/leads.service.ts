import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoLead } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  // Público: registra un cliente potencial desde la web.
  create(dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: { ...dto, email: dto.email.toLowerCase() },
      select: { id: true, createdAt: true },
    });
  }

  findAll(estado?: EstadoLead) {
    return this.prisma.lead.findMany({
      where: estado ? { estado } : {},
      orderBy: { createdAt: 'desc' },
      include: { cotizaciones: { select: { id: true, codigo: true, estado: true } } },
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { cotizaciones: true },
    });
    if (!lead) throw new NotFoundException('Lead no encontrado.');
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto) {
    await this.findOne(id);
    return this.prisma.lead.update({ where: { id }, data: dto });
  }
}

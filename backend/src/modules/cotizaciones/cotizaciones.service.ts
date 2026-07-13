import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoCotizacion } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCotizacionDto, UpdateCotizacionDto } from './dto';

@Injectable()
export class CotizacionesService {
  constructor(private prisma: PrismaService) {}

  private async generarCodigo(): Promise<string> {
    const anio = new Date().getFullYear();
    const total = await this.prisma.cotizacion.count();
    return `COT-${anio}-${String(total + 1).padStart(4, '0')}`;
  }

  async create(dto: CreateCotizacionDto) {
    const codigo = await this.generarCodigo();
    return this.prisma.cotizacion.create({
      data: {
        codigo,
        leadId: dto.leadId,
        notas: dto.notas,
        montoEstimado: dto.montoEstimado,
        asignadoAId: dto.asignadoAId,
        items: dto.items ? { create: dto.items } : undefined,
      },
      include: { items: true, lead: true },
    });
  }

  findAll(estado?: EstadoCotizacion) {
    return this.prisma.cotizacion.findMany({
      where: estado ? { estado } : {},
      orderBy: { createdAt: 'desc' },
      include: { lead: { select: { nombre: true, empresa: true, email: true } }, items: true },
    });
  }

  async findOne(id: string) {
    const c = await this.prisma.cotizacion.findUnique({
      where: { id },
      include: { lead: true, items: { include: { servicio: true } }, asignadoA: { select: { nombre: true } } },
    });
    if (!c) throw new NotFoundException('Cotización no encontrada.');
    return c;
  }

  async update(id: string, dto: UpdateCotizacionDto) {
    await this.findOne(id);
    return this.prisma.cotizacion.update({ where: { id }, data: dto, include: { items: true } });
  }
}

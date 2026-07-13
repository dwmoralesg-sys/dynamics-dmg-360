import { Injectable, NotFoundException } from '@nestjs/common';
import { AreaServicio } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServicioDto, UpdateServicioDto } from './dto';

@Injectable()
export class ServiciosService {
  constructor(private prisma: PrismaService) {}

  // Público: solo servicios activos
  findPublic(area?: AreaServicio) {
    return this.prisma.servicio.findMany({
      where: { activo: true, ...(area ? { area } : {}) },
      orderBy: [{ destacado: 'desc' }, { orden: 'asc' }],
    });
  }

  findAll() {
    return this.prisma.servicio.findMany({ orderBy: [{ area: 'asc' }, { orden: 'asc' }] });
  }

  async findBySlug(slug: string) {
    const s = await this.prisma.servicio.findUnique({ where: { slug } });
    if (!s) throw new NotFoundException('Servicio no encontrado.');
    return s;
  }

  create(dto: CreateServicioDto) {
    return this.prisma.servicio.create({ data: dto });
  }

  async update(id: string, dto: UpdateServicioDto) {
    await this.ensure(id);
    return this.prisma.servicio.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.servicio.delete({ where: { id } });
  }

  private async ensure(id: string) {
    const s = await this.prisma.servicio.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Servicio no encontrado.');
  }
}

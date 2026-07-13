import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProyectoDto, UpdateProyectoDto } from './dto';

@Injectable()
export class ProyectosService {
  constructor(private prisma: PrismaService) {}

  findPublic() {
    return this.prisma.proyecto.findMany({
      where: { publicado: true },
      orderBy: [{ destacado: 'desc' }, { orden: 'asc' }],
    });
  }

  findAll() { return this.prisma.proyecto.findMany({ orderBy: { orden: 'asc' } }); }

  async findBySlug(slug: string) {
    const p = await this.prisma.proyecto.findUnique({ where: { slug } });
    if (!p) throw new NotFoundException('Proyecto no encontrado.');
    return p;
  }

  create(dto: CreateProyectoDto) { return this.prisma.proyecto.create({ data: dto }); }

  async update(id: string, dto: UpdateProyectoDto) {
    await this.ensure(id);
    return this.prisma.proyecto.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.proyecto.delete({ where: { id } });
  }

  private async ensure(id: string) {
    const p = await this.prisma.proyecto.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Proyecto no encontrado.');
  }
}

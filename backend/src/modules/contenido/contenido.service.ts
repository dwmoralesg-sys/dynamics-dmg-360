import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertContenidoDto } from './dto';

@Injectable()
export class ContenidoService {
  constructor(private prisma: PrismaService) {}

  // Público: devuelve los bloques de un grupo como objeto clave->valor.
  async porGrupo(grupo: string) {
    const bloques = await this.prisma.contenidoWeb.findMany({ where: { grupo } });
    return bloques.reduce<Record<string, string>>((acc, b) => {
      acc[b.clave] = b.valor;
      return acc;
    }, {});
  }

  findAll() { return this.prisma.contenidoWeb.findMany({ orderBy: { grupo: 'asc' } }); }

  upsert(dto: UpsertContenidoDto) {
    return this.prisma.contenidoWeb.upsert({
      where: { clave: dto.clave },
      update: { valor: dto.valor, tipo: dto.tipo, grupo: dto.grupo, descripcion: dto.descripcion },
      create: { ...dto, tipo: dto.tipo ?? 'TEXTO' },
    });
  }
}

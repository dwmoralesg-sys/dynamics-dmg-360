import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto';

const publicSelect = {
  id: true, nombre: true, email: true, rol: true,
  activo: true, ultimoAcceso: true, createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({ select: publicSelect, orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateUsuarioDto) {
    const exists = await this.prisma.usuario.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new ConflictException('Ya existe un usuario con ese correo.');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.prisma.usuario.create({
      data: { nombre: dto.nombre, email: dto.email.toLowerCase(), passwordHash, rol: dto.rol ?? 'EDITOR' },
      select: publicSelect,
    });
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    await this.ensure(id);
    return this.prisma.usuario.update({ where: { id }, data: dto, select: publicSelect });
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.usuario.update({ where: { id }, data: { activo: false }, select: publicSelect });
  }

  private async ensure(id: string) {
    const u = await this.prisma.usuario.findUnique({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado.');
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const ok = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales incorrectas.');

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() },
    });

    const token = await this.jwt.signAsync({
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return {
      accessToken: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}

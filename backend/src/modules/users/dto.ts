import { Rol } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString() nombre: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsOptional() @IsEnum(Rol) rol?: Rol;
}

export class UpdateUsuarioDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsEnum(Rol) rol?: Rol;
  @IsOptional() @IsBoolean() activo?: boolean;
}

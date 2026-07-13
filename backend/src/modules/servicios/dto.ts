import { AreaServicio } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServicioDto {
  @IsString() slug: string;
  @IsString() titulo: string;
  @IsString() resumen: string;
  @IsString() descripcion: string;
  @IsEnum(AreaServicio) area: AreaServicio;
  @IsOptional() @IsString() icono?: string;
  @IsOptional() @IsString() imagenUrl?: string;
  @IsOptional() @IsNumber() precioReferencial?: number;
  @IsOptional() @IsBoolean() destacado?: boolean;
  @IsOptional() @IsInt() orden?: number;
  @IsOptional() @IsBoolean() activo?: boolean;
}

export class UpdateServicioDto {
  @IsOptional() @IsString() titulo?: string;
  @IsOptional() @IsString() resumen?: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsEnum(AreaServicio) area?: AreaServicio;
  @IsOptional() @IsString() icono?: string;
  @IsOptional() @IsString() imagenUrl?: string;
  @IsOptional() @IsNumber() precioReferencial?: number;
  @IsOptional() @IsBoolean() destacado?: boolean;
  @IsOptional() @IsInt() orden?: number;
  @IsOptional() @IsBoolean() activo?: boolean;
}

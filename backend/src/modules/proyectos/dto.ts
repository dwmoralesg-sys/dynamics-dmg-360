import { AreaServicio, EstadoProyecto } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProyectoDto {
  @IsString() slug: string;
  @IsString() titulo: string;
  @IsOptional() @IsString() cliente?: string;
  @IsString() resumen: string;
  @IsString() descripcion: string;
  @IsEnum(AreaServicio) area: AreaServicio;
  @IsOptional() @IsString() imagenUrl?: string;
  @IsOptional() @IsString() resultados?: string;
  @IsOptional() @IsEnum(EstadoProyecto) estado?: EstadoProyecto;
  @IsOptional() @IsBoolean() destacado?: boolean;
  @IsOptional() @IsInt() orden?: number;
  @IsOptional() @IsBoolean() publicado?: boolean;
}

export class UpdateProyectoDto {
  @IsOptional() @IsString() titulo?: string;
  @IsOptional() @IsString() cliente?: string;
  @IsOptional() @IsString() resumen?: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsEnum(AreaServicio) area?: AreaServicio;
  @IsOptional() @IsString() imagenUrl?: string;
  @IsOptional() @IsString() resultados?: string;
  @IsOptional() @IsEnum(EstadoProyecto) estado?: EstadoProyecto;
  @IsOptional() @IsBoolean() destacado?: boolean;
  @IsOptional() @IsInt() orden?: number;
  @IsOptional() @IsBoolean() publicado?: boolean;
}

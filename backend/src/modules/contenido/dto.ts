import { TipoContenido } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpsertContenidoDto {
  @IsString() clave: string;
  @IsString() grupo: string;
  @IsOptional() @IsEnum(TipoContenido) tipo?: TipoContenido;
  @IsString() valor: string;
  @IsOptional() @IsString() descripcion?: string;
}

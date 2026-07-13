import { EstadoCotizacion } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class CotizacionItemDto {
  @IsOptional() @IsString() servicioId?: string;
  @IsString() descripcion: string;
  @IsInt() @Min(1) cantidad: number;
  @IsOptional() @IsNumber() precioUnitario?: number;
}

export class CreateCotizacionDto {
  @IsString() leadId: string;
  @IsOptional() @IsString() notas?: string;
  @IsOptional() @IsNumber() montoEstimado?: number;
  @IsOptional() @IsString() asignadoAId?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CotizacionItemDto)
  items?: CotizacionItemDto[];
}

export class UpdateCotizacionDto {
  @IsOptional() @IsEnum(EstadoCotizacion) estado?: EstadoCotizacion;
  @IsOptional() @IsString() notas?: string;
  @IsOptional() @IsNumber() montoEstimado?: number;
  @IsOptional() @IsString() asignadoAId?: string;
}

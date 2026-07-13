import { AreaServicio, EstadoLead } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLeadDto {
  @IsString() @MinLength(2) @MaxLength(120) nombre: string;
  @IsOptional() @IsString() @MaxLength(150) empresa?: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() @MaxLength(30) telefono?: string;
  @IsOptional() @IsString() @MaxLength(120) ciudad?: string;
  @IsOptional() @IsString() @MaxLength(120) pais?: string;
  @IsOptional() @IsEnum(AreaServicio) area?: AreaServicio;
  @IsString() @MinLength(10) @MaxLength(2000) mensaje: string;
  @IsOptional() @IsString() @MaxLength(120) origen?: string;
}

export class UpdateLeadDto {
  @IsOptional() @IsEnum(EstadoLead) estado?: EstadoLead;
}

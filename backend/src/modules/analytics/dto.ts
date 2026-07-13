import { IsOptional, IsString, MaxLength } from 'class-validator';

// Datos NO personales de una visita anónima.
export class TrackVisitaDto {
  @IsString() @MaxLength(300) path: string;
  @IsOptional() @IsString() @MaxLength(300) referer?: string;
  @IsOptional() @IsString() @MaxLength(120) fuente?: string;
  @IsOptional() @IsString() @MaxLength(120) campana?: string;
  @IsOptional() @IsString() @MaxLength(120) sessionId?: string;
}

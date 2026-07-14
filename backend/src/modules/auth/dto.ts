import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Correo inválido.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  actual: string;

  @IsString()
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres.' })
  nueva: string;
}

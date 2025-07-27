// src/auth/dto/change-password.dto.ts o src/users/dto/change-password.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres.' }) // O tu longitud mínima deseada
  newPassword: string;
}
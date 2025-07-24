// src/auth/dto/create-user.dto.ts
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
  IsMongoId,
  IsEmail,
} from 'class-validator';
import { UserRole } from '../schemas/user.schema';
import { CategoryEnum } from 'src/competitors/enums/category.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string; // Puede ser un email

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsEnum(UserRole)
  @IsOptional() // Si no se especifica, tomará el valor por defecto del esquema
  role: UserRole;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(CategoryEnum, { message: 'Categoría inválida. Debe ser INFANTIL, JUVENIL, ADULTO.' })
  category?: CategoryEnum;

}
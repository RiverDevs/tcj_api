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
import { CategoryEnum } from 'src/competitors/enums/category.enum'; // Asegúrate de que esta ruta sea correcta

export class UpdateUserDto {
  @IsString()
  @IsOptional() // Username es opcional para la edición
  username?: string;

  @IsString()
  @IsOptional() // La contraseña es opcional para la edición, se manejará con un DTO separado si se cambia
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password?: string; // Solo se usa si se cambia la contraseña directamente

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

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
  @IsOptional() // La categoría es opcional
  category?: CategoryEnum;

  // Si necesitas actualizar las referencias a Judge/Competitor, podrías añadirlas aquí
  @IsMongoId()
  @IsOptional()
  judgeRef?: string;

  @IsMongoId()
  @IsOptional()
  competitorRef?: string;
}
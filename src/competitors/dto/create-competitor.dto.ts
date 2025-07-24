// src/competitors/dto/create-competitor.dto.ts
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { CategoryEnum } from '../enums/category.enum';

export class CreateCompetitorDto {

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(CategoryEnum, { message: 'Categoría inválida. Debe ser INFANTIL, JUVENIL, ADULTO o MASTER.' })
  category: CategoryEnum;
}

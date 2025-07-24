// src/competitors/dto/update-competitor.dto.ts
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CategoryEnum } from '../enums/category.enum';

export class UpdateCompetitorDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsEnum(CategoryEnum, { message: 'Categoría inválida.' })
  category?: CategoryEnum;
}

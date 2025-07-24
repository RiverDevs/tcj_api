// src/matches/dto/update-match.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchDto } from './create-match.dto';
import { IsMongoId, IsOptional, IsArray, ArrayMinSize, ArrayMaxSize, IsEnum, IsNotEmpty } from 'class-validator';
import { CategoryEnum } from 'src/categories/enums/category.enum';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  // Sobrescribir validaciones específicas si es necesario, aunque PartialType hace todo opcional
  @IsMongoId()
  @IsOptional()
  tournament?: string;

  @IsEnum(CategoryEnum)
  @IsNotEmpty()
  category: CategoryEnum;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsMongoId({ each: true })
  @IsOptional()
  competitors?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  judges?: string[];

  @IsMongoId()
  @IsOptional()
  winner?: string;
}

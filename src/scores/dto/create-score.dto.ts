// src/scores/dto/create-score.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateScoreDto {
  @IsMongoId()
  @IsNotEmpty()
  match: string; // ID del partido

  @IsMongoId()
  @IsNotEmpty()
  competitor: string; // ID del competidor

  @IsMongoId()
  @IsNotEmpty()
  judge: string; // ID del juez

  @IsNumber()
  @IsNotEmpty()
  @Min(0) // Asume que la puntuación mínima es 0
  // @Max(10) // Puedes definir un máximo, ej. si es de 1 a 10
  value: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  @IsOptional()
  isValid?: boolean;
}
// src/evaluations/dto/create-evaluation.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsMongoId, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para el objeto anidado 'judge'
class JudgeDto {
  @IsMongoId() // Valida que sea un ID válido de MongoDB
  @IsNotEmpty()
  id: string; // Recibirás el ID del juez como string desde el frontend

  @IsString()
  @IsNotEmpty()
  username: string;
}

// DTO para el objeto anidado 'pair'
class PairDto {
  @IsString() // Asumimos que el pairId es un string (puede ser UUID, etc.)
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  competitor1: number;

  @IsNumber()
  @IsNotEmpty()
  competitor2: number;
}

// DTO principal para crear una evaluación
export class CreateEvaluationDto {
  @IsMongoId() // Si tu tournamentId es un ObjectId de MongoDB
  @IsNotEmpty()
  tournamentId: string;

  @IsString()
  @IsNotEmpty()
  tournamentName: string;

  @IsString()
  @IsNotEmpty()
  group: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  subCategory: string;

  @IsNumber()
  @IsNotEmpty()
  roundNumber: number;

  @IsNumber()
  @IsNotEmpty()
  competitorCount: number;

  @ValidateNested() // Permite validar objetos anidados
  @IsObject()
  @Type(() => JudgeDto) // Importante para la transformación de clase
  judge: JudgeDto;

  @ValidateNested()
  @IsObject()
  @Type(() => PairDto)
  pair: PairDto;

  @IsNumber()
  @IsNotEmpty()
  scoreCompetitor1: number;

  @IsNumber()
  @IsNotEmpty()
  scoreCompetitor2: number;

  @IsString()
  @IsNotEmpty()
  resultType: string;
}
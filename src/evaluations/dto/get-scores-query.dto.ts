// src/evaluations/dto/get-scores-query.dto.ts (Este es para los parámetros de la URL de un GET)
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumberString, IsMongoId, IsNumber, IsInt, Min } from 'class-validator';

export class GetScoresQueryDto {
  @IsMongoId()
  @IsNotEmpty()
  tournamentId: string;

  @IsString()
  @IsNotEmpty()
  group: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  subCategory: string;

  @Type(() => Number) // <-- ¡Esta es la clave! Transforma la cadena a número.
  @IsInt() // Asegura que sea un entero
  @Min(1) // Por ejemplo, que sea al menos 1
  roundNumber: number; // Esperamos que al final sea un número
}
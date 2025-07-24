// src/evaluations/dto/admin-report-config.dto.ts (crea este nuevo DTO)
import { IsNotEmpty, IsString, IsNumber, IsMongoId, IsArray, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// Puedes omitir los DTOs anidados selectedJudgeIds y selectedJudgeUsernames si no los necesitas en el backend para esta consulta
export class AdminReportConfigDto {
  @IsMongoId()
  @IsNotEmpty()
  tournamentId: string;

  @IsString()
  @IsNotEmpty()
  tournamentName: string; // Opcional si no lo usas en el backend

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
  competitorCount: number; // Opcional si no lo usas en el backend

  // Puedes dejar estos o quitarlos si solo te interesan para el frontend
  @IsArray()
  selectedJudgeIds: string[];

  @IsObject()
  selectedJudgeUsernames: Record<string, string>;
}
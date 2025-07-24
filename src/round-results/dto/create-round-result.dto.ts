// src/round-results/dto/create-round-result.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class JudgeScoreEntryDto {
  @IsString()
  @IsNotEmpty()
  judgeUsername: string;

  @IsNumber()
  score: number;
}

class CompetitorResultDto {
  @IsNumber()
  competitorNumber: number;

  @IsNumber()
  finalScore: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JudgeScoreEntryDto)
  judgesScores: JudgeScoreEntryDto[];
}

export class CreateRoundResultDto {
  @IsString()
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
  @IsOptional()
  subCategory?: string;

  @IsNumber()
  roundNumber: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompetitorResultDto)
  @IsNotEmpty()
  results: CompetitorResultDto[];
}
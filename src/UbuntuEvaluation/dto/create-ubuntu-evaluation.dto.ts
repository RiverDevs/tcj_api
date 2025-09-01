import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TeamEvaluationDto {
  @IsString()
  @IsNotEmpty()
  teamName: string;

  @IsNumber()
  score: number;
}

class PenaltyDto {
  @IsString()
  @IsNotEmpty()
  teamName: string;

  @IsNumber()
  value: number;

  @IsString()
  description?: string;
}

export class CreateUbuntuEvaluationDto {
  @IsString()
  @IsNotEmpty()
  tournamentId: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  subCategory?: string;

  @IsString()
  @IsNotEmpty()
  pairId: string;

  @IsNumber()
  @IsNotEmpty()
  roundNumber: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamEvaluationDto)
  teamScores: TeamEvaluationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PenaltyDto)
  penalties: PenaltyDto[];

  @IsString()
  @IsNotEmpty()
  judgeId: string;

  @IsString()
  @IsNotEmpty()
  judgeUsername: string;
}
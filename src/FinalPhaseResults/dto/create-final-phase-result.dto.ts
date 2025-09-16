import { IsString, IsNotEmpty, IsObject, IsIn } from 'class-validator';

export class CreateFinalPhaseResultDto {
  @IsNotEmpty()
  @IsString()
  tournament: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Fase 1', 'Fase 2', 'Fase 3'])
  round: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  subCategory: string; 

  @IsNotEmpty()
  @IsString()
  teams: string; 

  @IsNotEmpty()
  @IsObject()
  results: Record<string, number>;
}
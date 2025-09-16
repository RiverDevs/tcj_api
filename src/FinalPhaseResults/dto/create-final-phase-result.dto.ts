import { IsString, IsNotEmpty, IsObject, IsIn } from 'class-validator';

export class CreateFinalPhaseResultDto {
  @IsNotEmpty()
  @IsString()
  tournament: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Fase 1 Jogo de Dentro', 'Fase 2 Jogo de Fora', 'Fase 3 Jogo Ligero'])
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
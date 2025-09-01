import { IsString, IsNotEmpty, IsObject, IsNumber, IsIn } from 'class-validator';

export class CreateFinalPhaseResultDto {
  @IsNotEmpty()
  @IsString()
  tournament: string;

  @IsNotEmpty()
  @IsString()
  round: string;

  @IsNotEmpty()
  @IsObject()
  results: Record<string, number>;
}
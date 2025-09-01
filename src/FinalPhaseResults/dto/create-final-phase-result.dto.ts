import { IsString, IsNotEmpty, IsObject, IsNumber, IsIn } from 'class-validator';

export class CreateFinalPhaseResultDto {
  @IsNotEmpty()
  @IsString()
  tournament: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Fase 1', 'Fase 2', 'Fase 3']) // Validación para aceptar solo estos valores
  round: string;

  @IsNotEmpty()
  @IsObject()
  results: Record<string, number>;
}
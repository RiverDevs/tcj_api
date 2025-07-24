
// src/scores/dto/assign-score.dto.ts
import { IsMongoId, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class AssignScoreDto {
  
  @IsMongoId({ message: 'El ID del competidor no es válido.' })
  @IsNotEmpty({ message: 'El campo "competitorId" es obligatorio.' })
  competitorId: string;

  @IsNumber({}, { message: 'El puntaje debe ser un número.' })
  @Min(0, { message: 'El puntaje no puede ser menor que 0.' })
  @Max(10, { message: 'El puntaje no puede ser mayor que 10.' })
  score: number;
}

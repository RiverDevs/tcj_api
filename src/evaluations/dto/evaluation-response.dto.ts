// src/evaluations/dto/evaluation-response.dto.ts
import { IsNumber, IsString } from 'class-validator';

export class EvaluationResponseDto {
  // El ID único de MongoDB para esta evaluación específica
  // Asumo que tu base de datos lo genera y lo devuelve
  _id: string; // O puedes llamarlo 'id: string;' si prefieres

  // El número del atleta. Tu frontend usa 'atletaId' de 1 a 16.
  // Tu CreateEvaluationDto tiene 'pair.competitor1' y 'pair.competitor2'.
  // Aquí podemos unificarlo a 'atletaId' para el frontend,
  // asumiendo que tu backend sabe cómo mapear el 'pair' a un único 'atletaId'
  // o que la evaluación es para un solo competidor por juez en la tabla de resultados.
  // Si tu tabla muestra un score por juez por atleta (y no por par de atletas),
  // esto requerirá que tu backend extraiga el número de atleta individual de 'pair.competitor1' o 'pair.competitor2'.
  @IsNumber()
  atletaId: number; // Mapea a 'i' en score-A${i}-J${juezId} de tu frontend

  // El ID del juez que emitió esta evaluación.
  // Tu CreateEvaluationDto tiene 'judge.id'. Queremos que esto venga directo como 'juezId'.
  @IsString()
  juezId: string; // Mapea a 'juezId' en score-A${i}-J${juezId} de tu frontend

  // Los puntajes exactos que tu frontend espera para la suma.
  @IsNumber()
  scoreCompetitor1: number;

  @IsNumber()
  scoreCompetitor2: number;

  // Puedes añadir más campos si tu frontend los necesitara para otras lógicas,
  // pero para rellenar la tabla de puntajes, estos son los esenciales.
  // @IsString()
  // tournamentId: string;
  // @IsNumber()
  // roundNumber: number;
}
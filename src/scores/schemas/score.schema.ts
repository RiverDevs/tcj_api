// src/scores/schemas/score.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Match } from '../../matches/schemas/match.schema';         // Importa Match
import { Competitor } from '../../competitors/schemas/competitor.schema'; // Importa Competitor
import { Judge } from '../../judges/schemas/judge.schema';           // Importa Judge

export type ScoreDocument = HydratedDocument<Score>;

@Schema({ timestamps: true })
export class Score {
  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  match: Types.ObjectId; // Referencia al partido al que pertenece esta puntuación

  @Prop({ type: Types.ObjectId, ref: 'Competitor', required: true })
  competitor: Types.ObjectId; // Referencia al competidor que recibió la puntuación

  @Prop({ type: Types.ObjectId, ref: 'Judge', required: true })
  judge: Types.ObjectId; // Referencia al juez que emitió esta puntuación

  @Prop({ required: true, min: 0 }) // Puntuación numérica (ej. 1-10)
  value: number;

  @Prop()
  comment?: string; // Comentarios adicionales del juez

  @Prop({ default: true })
  isValid: boolean; // Para marcar si la puntuación es válida o fue anulada
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
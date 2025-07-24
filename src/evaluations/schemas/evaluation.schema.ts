// src/evaluations/schemas/evaluation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EvaluationDocument = Evaluation & Document;

@Schema({ timestamps: true }) // `timestamps: true` añade automáticamente createdAt y updatedAt
export class Evaluation {
  @Prop({ type: Types.ObjectId, ref: 'Tournament', required: true })
  tournamentId: Types.ObjectId; // Si tienes un modelo de Torneo, usa Types.ObjectId

  @Prop({ required: true })
  tournamentName: string;

  @Prop({ required: true })
  group: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subCategory: string;

  @Prop({ required: true })
  roundNumber: number;

  @Prop({ required: true })
  competitorCount: number;

  @Prop({ type: Object, required: true }) // Objeto anidado para el juez
  judge: {
    id: Types.ObjectId; // El ID del juez, si lo obtienes de un usuario autenticado
    username: string;
  };

  @Prop({ type: Object, required: true }) // Objeto anidado para la pareja
  pair: {
    id: string; // El ID de la pareja (puede ser un string generado en frontend o un ObjectId)
    competitor1: number; // O string, si los identificadores son alfanuméricos
    competitor2: number; // O string
  };

  @Prop({ required: true })
  scoreCompetitor1: number;

  @Prop({ required: true })
  scoreCompetitor2: number;

  @Prop({ required: true })
  resultType: string; // "Ganador Izquierdo", "Empate en Alta", etc.
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);

// Opcional: Puedes añadir índices si necesitas búsquedas rápidas
// EvaluationSchema.index({ tournamentId: 1, 'judge.id': 1, 'pair.id': 1 }, { unique: true });
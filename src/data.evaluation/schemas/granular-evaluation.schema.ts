import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GranularEvaluationDocument = GranularEvaluation & Document;

@Schema({ timestamps: true })
export class GranularEvaluation {
  @Prop({ required: true })
  tournamentId: string;

  @Prop({ required: true })
  tournamentName: string;

  @Prop({ required: true })
  group: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: false }) // Puede que no siempre haya subcategoría
  subCategory: string;

  @Prop({ required: true, type: Number })
  roundNumber: number;

  @Prop({ required: true, type: Number })
  vuelta: number;

  @Prop({ required: true, type: Number })
  competitorNumber: number;

  // --- CAMBIOS CRÍTICOS AQUÍ ---
  // Haz que 'score' no sea requerido a nivel de DB. La validación condicional se hará en el DTO de NestJS.
  @Prop({ required: false, type: Number }) // <--- CAMBIO: required: false
  score?: number; // Usa '?' para indicar que es opcional en TypeScript también

  // Agrega el campo 'type' para diferenciar puntuación de penalización
  @Prop({ required: false, type: String }) // <--- CAMBIO: required: false
  type?: string; // Por ejemplo, "Penalización"

  // Agrega el campo 'value' para el valor de la penalización
  @Prop({ required: false, type: Number }) // <--- CAMBIO: required: false
  value?: number;
  // --- FIN CAMBIOS CRÍTICOS ---

  @Prop({ required: true })
  judgeId: string;

  @Prop({ required: true })
  judgeUsername: string;

  @Prop({ required: true })
  pairId: string;
}

export const GranularEvaluationSchema = SchemaFactory.createForClass(GranularEvaluation);
// src/round-results/schemas/round-result.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoundResultDocument = RoundResult & Document;

@Schema({ timestamps: true }) // Añade timestamps para createdAt y updatedAt
export class RoundResult extends Document { // <-- CAMBIO AQUÍ: extiende Document
  @Prop({ required: true, index: true })
  tournamentId: string;

  @Prop({ required: true, index: true })
  tournamentName: string; // Para facilitar la visualización sin necesidad de JOIN

  @Prop({ required: true, index: true })
  group: string;

  @Prop({ required: true, index: true })
  category: string;

  @Prop() // Opcional, ya que no todas las categorías tienen subcategoría
  subCategory?: string;

  @Prop({ required: true, type: Number, index: true })
  roundNumber: number;

  @Prop({
    type: [{
      competitorNumber: { type: Number, required: true },
      finalScore: { type: Number, required: true },
      judgesScores: [{ // Guardamos también los scores individuales de los jueces por si son necesarios
        judgeUsername: { type: String, required: true },
        score: { type: Number, required: true }
      }]
    }],
    required: true
  })
  results: {
    competitorNumber: number;
    finalScore: number;
    judgesScores: { judgeUsername: string; score: number }[];
  }[];
}

export const RoundResultSchema = SchemaFactory.createForClass(RoundResult);
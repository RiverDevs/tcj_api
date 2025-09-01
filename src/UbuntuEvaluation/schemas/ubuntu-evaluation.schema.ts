import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define el tipo para la sub-evaluación de un equipo
@Schema()
export class TeamEvaluation {
  @Prop({ required: true })
  teamName: string;

  @Prop({ required: true, type: Number })
  score: number;
}
const TeamEvaluationSchema = SchemaFactory.createForClass(TeamEvaluation);

// Define el tipo para las penalizaciones
@Schema()
export class Penalty {
  @Prop({ required: true })
  teamName: string;

  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ required: false })
  description?: string;
}
const PenaltySchema = SchemaFactory.createForClass(Penalty);

export type UbuntuEvaluationDocument = UbuntuEvaluation & Document;

@Schema({ timestamps: true })
export class UbuntuEvaluation {
  @Prop({ required: true })
  tournamentId: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: false })
  subCategory?: string;

  @Prop({ required: true })
  pairId: string; // Ejemplo: "equipoA-equipoB"

  @Prop({ required: true, type: Number })
  roundNumber: number;

  @Prop({ required: true, type: [TeamEvaluationSchema] })
  teamScores: TeamEvaluation[];

  @Prop({ required: true, type: [PenaltySchema] })
  penalties: Penalty[];

  @Prop({ required: true })
  judgeId: string;

  @Prop({ required: true })
  judgeUsername: string;
}

export const UbuntuEvaluationSchema = SchemaFactory.createForClass(UbuntuEvaluation);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FinalPhaseResultDocument = FinalPhaseResult & Document;

@Schema()
export class FinalPhaseResult {
  @Prop({ required: true })
  tournament: string;

  @Prop({ required: true })
  round: string;

  @Prop({ type: Object, required: true })
  results: Record<string, number>;
}

export const FinalPhaseResultSchema = SchemaFactory.createForClass(FinalPhaseResult);
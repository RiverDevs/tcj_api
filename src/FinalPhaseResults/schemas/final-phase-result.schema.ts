import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FinalPhaseResultDocument = FinalPhaseResult & Document;

@Schema()
export class FinalPhaseResult {
  @Prop({ required: true })
  tournament: string;

  @Prop({ required: true })
  round: string;

  @Prop({ required: true })
  category: string; 

  @Prop({ required: true })
  subCategory: string; 

  @Prop({ required: true })
  teams: string; 

  @Prop({ type: Object, required: true })
  results: Record<string, number>;
}

export const FinalPhaseResultSchema = SchemaFactory.createForClass(FinalPhaseResult);
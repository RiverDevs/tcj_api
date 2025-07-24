
// src/competitors/schemas/competitor.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CategoryEnum } from '../enums/category.enum';

@Schema()
export class Competitor {

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  email?: string;

  @Prop({ type: String, enum: CategoryEnum, required: true })
  category: CategoryEnum;
}

export type CompetitorDocument = Competitor & Document;
export const CompetitorSchema = SchemaFactory.createForClass(Competitor);

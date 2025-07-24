
// src/judges/schemas/judge.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JudgeDocument = HydratedDocument<Judge>;

@Schema({ timestamps: true })
export class Judge {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email?: string;

  @Prop()
  phone?: string;

  @Prop({ default: true })
  isActive: boolean; // Para activar o desactivar jueces

  // Puedes añadir otros campos como una identificación de juez, especialidad, etc.
  @Prop()
  certificationId?: string;
}

export const JudgeSchema = SchemaFactory.createForClass(Judge);

// src/tournaments/schemas/tournament.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Judge } from '../../judges/schemas/judge.schema';           // Importa Judge
import { CategoryEnum } from 'src/categories/enums/category.enum';

export type TournamentDocument = HydratedDocument<Tournament>;

@Schema({ timestamps: true }) // Añade createdAt y updatedAt automáticamente
export class Tournament {
  @Prop({ required: true, unique: true })
  name: string; // Ejemplo: "Torneo Abierto de Capoeira Maipú 2025"

  @Prop({ required: true })
  location: string; // Ejemplo: "Gimnasio Municipal de Maipú"

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ default: 'scheduled' }) // 'scheduled', 'active', 'completed', 'cancelled'
  status: string;

  @Prop({ type: String, enum: CategoryEnum })
  category: CategoryEnum;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Judge' }] })
  judges: Types.ObjectId[]; // Array de IDs de jueces asignados al torneo

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  maxCompetitors?: number; // Límite de competidores

  @Prop({ default: 0 })
  registeredCompetitors: number; // Conteo de competidores registrados (se podría actualizar automáticamente o manualmente)

  @Prop({ default: true })
  isActive: boolean; // Para activar/desactivar la visibilidad o participación
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);
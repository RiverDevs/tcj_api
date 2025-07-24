
// src/matches/schemas/match.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CategoryEnum } from 'src/competitors/enums/category.enum';
import { MatchStatus } from '../enums/status.enum';



export type MatchDocument = HydratedDocument<Match>;

@Schema({ timestamps: true })
export class Match {

  @Prop({ type: Types.ObjectId, ref: 'Tournament', required: true })
  tournament: Types.ObjectId; // Referencia al torneo al que pertenece el partido

  @Prop({ type: String, enum: CategoryEnum, required: true })
  category: CategoryEnum;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Competitor' }], required: true, minlength: 2, maxlength: 2 })
  competitors: Types.ObjectId[]; // Array de IDs de los 2 competidores que participan en este partido

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Judge' }], required: true })
  judges: Types.ObjectId[]; // Array de IDs de los jueces que puntuarán esta partida

  @Prop({ type: String, enum: MatchStatus, default: MatchStatus.PENDING })
  status: MatchStatus;

  @Prop({ type: Date, default: Date.now })
  startTime: Date; // Hora de inicio planificada o real

  @Prop({ type: Date })
  endTime?: Date; // Hora de finalización real

  @Prop()
  round?: string; // Por ejemplo, "Ronda 1", "Semifinal", "Final"

  @Prop()
  matchNumber?: number; // Número de partido dentro del torneo/ronda

  @Prop({ type: Types.ObjectId, ref: 'Competitor' })
  winner?: Types.ObjectId; // ID del competidor ganador (si aplica, ej. en eliminatorias)

  @Prop()
  notes?: string; // Notas adicionales sobre el partido
}

export const MatchSchema = SchemaFactory.createForClass(Match);
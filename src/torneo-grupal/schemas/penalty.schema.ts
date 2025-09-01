// src/torneo-grupal/schemas/penalty.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PenaltyDocument = Penalty & Document;

@Schema({ _id: false }) // _id: false evita que se genere un _id para el subdocumento
export class PenaltyLog {
    @Prop({ required: true })
    team: string;

    @Prop({ required: true })
    points: number;

    @Prop({ required: true })
    reason: string;
}
export const PenaltyLogSchema = SchemaFactory.createForClass(PenaltyLog);

@Schema()
export class Penalty {
    @Prop({ required: true })
    torneo: string;

    @Prop({ required: true })
    equipoJueces: string;

    @Prop({ required: true })
    categoria: string;

    @Prop({ required: true })
    subcategoria: string;

    @Prop({ required: true })
    fase: string;

    @Prop({ required: true })
    equipo: string;

    @Prop({ type: [PenaltyLogSchema], required: true })
    penaltiesLog: PenaltyLog[];
}

export const PenaltySchema = SchemaFactory.createForClass(Penalty);
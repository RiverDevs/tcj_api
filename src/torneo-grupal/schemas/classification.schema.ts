// src/torneo-grupal/schemas/classification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClassificationDocument = Classification & Document;

@Schema()
export class Classification {
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
    equipoGanador: string;

    @Prop({ required: true })
    puntajeGanador: number;

    @Prop({ required: true })
    equipoPerdedor: string;

    @Prop({ required: true })
    puntajePerdedor: number;
}

export const ClassificationSchema = SchemaFactory.createForClass(Classification);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClassificationDocument = Classification & Document;

// Sub-esquema para los registros de clasificación, similar a PenaltyLog
@Schema({ _id: false })
export class ClassificationLog {
    @Prop({ required: true })
    team: string;

    @Prop({ required: true })
    points: number;

    @Prop({ required: true })
    reason: string;
}

export const ClassificationLogSchema = SchemaFactory.createForClass(ClassificationLog);

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
    equipo: string;

    @Prop({ type: [ClassificationLogSchema], required: true })
    calificationLog: ClassificationLog[];
}

export const ClassificationSchema = SchemaFactory.createForClass(Classification);
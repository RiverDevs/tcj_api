// src/torneo-grupal/dto/create-classification.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateClassificationDto {
    @IsString()
    readonly torneo: string;

    @IsString()
    readonly equipoJueces: string;

    @IsString()
    readonly categoria: string;

    @IsString()
    readonly subcategoria: string;

    @IsString()
    readonly fase: string;

    @IsString()
    readonly equipoGanador: string;

    @IsNumber()
    readonly puntajeGanador: number;

    @IsString()
    readonly equipoPerdedor: string;

    @IsNumber()
    readonly puntajePerdedor: number;
}
import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para el sub-documento del log de clasificación
export class ClassificationLogDto {
    @IsNotEmpty()
    @IsString()
    team: string;

    @IsNotEmpty()
    @IsNumber()
    points: number;

    @IsNotEmpty()
    @IsString()
    reason: string;
}

// DTO principal para la creación de una clasificación
export class CreateClassificationDto {
    @IsNotEmpty()
    @IsString()
    readonly torneo: string;

    @IsNotEmpty()
    @IsString()
    readonly equipoJueces: string;

    @IsNotEmpty()
    @IsString()
    readonly categoria: string;

    @IsNotEmpty()
    @IsString()
    readonly subcategoria: string;

    @IsNotEmpty()
    @IsString()
    readonly fase: string;

    @IsNotEmpty()
    @IsString()
    readonly equipo: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ClassificationLogDto)
    readonly calificationLog: ClassificationLogDto[];
}
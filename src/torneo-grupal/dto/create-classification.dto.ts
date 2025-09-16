import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClassificationLogDto } from './classification-log.dto';

// DTO principal para la creación de una clasificación
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
    readonly equipo: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ClassificationLogDto)
    readonly calificationLog: ClassificationLogDto[];
}
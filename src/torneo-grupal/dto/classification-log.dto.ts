import { IsNumber, IsString } from "class-validator";



// DTO para el sub-documento del log de clasificación
export class ClassificationLogDto {
    @IsString()
    team: string;

    @IsNumber()
    points: number;

    @IsString()
    reason: string;
}
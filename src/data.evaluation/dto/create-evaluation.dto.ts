import { IsNumber, IsString, IsOptional, IsNotEmpty, ValidateIf } from 'class-validator';

export class CreateDataEvaluationDto {
    @IsNotEmpty()
    @IsString()
    tournamentId: string;

    @IsNotEmpty()
    @IsString()
    tournamentName: string;

    @IsNotEmpty()
    @IsString()
    group: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    subCategory?: string;

    @IsNumber()
    roundNumber: number;

    @IsNotEmpty()
    @IsString()
    judgeId: string;

    @IsNotEmpty()
    @IsString()
    judgeUsername: string;

    @IsNotEmpty()
    @IsString()
    pairId: string;

    @IsNumber()
    vuelta: number;

    // --- Campo para el número de competidor (nuevo/confirmado) ---
    // Este campo es crucial porque lo estás enviando y tu DB lo espera.
    @IsNotEmpty()
    @IsNumber({}, { message: 'competitorNumber must be a valid number' })
    competitorNumber: number; // Agregado y marcado como obligatorio numérico

    // --- Campos para Puntuación normal ---
    // 'score' es requerido si 'type' no está definido (es una evaluación normal)
    // O si 'type' es definido pero NO es "Penalización".
    @ValidateIf(o => o.type === undefined || o.type !== 'Penalización')
    @IsNumber()
    @IsNotEmpty({ message: 'Score cannot be empty when type is not specified or is not Penalty' })
    score?: number; // Sigue siendo opcional a nivel de TypeScript, pero condicionalmente requerido por 'class-validator'

    // --- Campos para Penalización ---
    // 'type' es opcional porque solo se envía para penalizaciones
    @IsOptional()
    @IsString()
    type?: string;

    // 'value' es requerido solo si 'type' es "Penalización"
    @ValidateIf(o => o.type === 'Penalización')
    @IsNumber({}, { message: 'Value must be a number when type is Penalty' })
    @IsNotEmpty({ message: 'Value cannot be empty when type is Penalty' })
    value?: number; // Sigue siendo opcional a nivel de TypeScript, pero condicionalmente requerido por 'class-validator'
}
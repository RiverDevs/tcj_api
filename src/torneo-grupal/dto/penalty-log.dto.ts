// src/torneo-grupal/dto/penalty-log.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class PenaltyLogDto {
    @IsString()
    team: string;

    @IsNumber()
    points: number;

    @IsString()
    reason: string;
}
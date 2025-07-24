// src/scores/dto/update-score.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateScoreDto } from './create-score.dto';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateScoreDto extends PartialType(CreateScoreDto) {
    @IsMongoId()
    @IsOptional()
    match?: string;

    @IsMongoId()
    @IsOptional()
    competitor?: string;

    @IsMongoId()
    @IsOptional()
    judge?: string;
}

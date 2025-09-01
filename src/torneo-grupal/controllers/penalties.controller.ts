// src/torneo-grupal/controllers/penalties.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PenaltiesService } from '../services/penalties.service';
import { CreatePenaltyDto } from '../dto/create-penalty.dto';

@Controller('penalties')
export class PenaltiesController {
    constructor(private readonly penaltiesService: PenaltiesService) {}

    @Post()
    async create(@Body() createPenaltyDto: CreatePenaltyDto) {
        try {
            const result = await this.penaltiesService.create(createPenaltyDto);
            return {
                message: 'Penalizaciones guardadas exitosamente',
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                'Error al guardar las penalizaciones',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
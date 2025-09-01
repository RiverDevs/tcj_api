// src/torneo-grupal/controllers/classifications.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ClassificationsService } from '../services/classifications.service';
import { CreateClassificationDto } from '../dto/create-classification.dto';

@Controller('classifications')
export class ClassificationsController {
    constructor(private readonly classificationsService: ClassificationsService) {}

    @Post()
    async create(@Body() createClassificationDto: CreateClassificationDto) {
        try {
            const result = await this.classificationsService.create(createClassificationDto);
            return {
                message: 'Clasificación guardada exitosamente',
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                'Error al guardar la clasificación',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
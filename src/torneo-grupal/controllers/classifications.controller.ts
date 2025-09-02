// src/torneo-grupal/controllers/classifications.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus, Get, Query } from '@nestjs/common';
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
    @Get()
    async findAll(@Query() query: any) {
        try {
            const classifications = await this.classificationsService.findAll(query);
            return classifications;
        } catch (error) {
            throw new HttpException(
                'Error al obtener las clasificaciones',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
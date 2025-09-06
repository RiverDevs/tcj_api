import { Controller, Post, Body, HttpException, HttpStatus, Get, Query, Put, Param } from '@nestjs/common';
import { ClassificationsService } from '../services/classifications.service';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { Classification } from '../schemas/classification.schema';

@Controller('classifications')
export class ClassificationsController {
    constructor(private readonly classificationsService: ClassificationsService) {}

    @Post()
    async create(@Body() createClassificationDto: CreateClassificationDto): Promise<{ message: string; data: Classification }> {
        try {
            const result = await this.classificationsService.create(createClassificationDto);
            return {
                message: 'Calificación guardada exitosamente',
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                'Error al guardar la calificación',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll(@Query() query: any): Promise<Classification[]> {
        try {
            const classifications = await this.classificationsService.findAll(query);
            return classifications;
        } catch (error) {
            throw new HttpException(
                'Error al obtener las calificaciones',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateData: any): Promise<{ message: string; data: Classification }> {
        try {
            const result = await this.classificationsService.update(id, updateData);
            return {
                message: 'Calificación actualizada exitosamente',
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                'Error al actualizar la calificación',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
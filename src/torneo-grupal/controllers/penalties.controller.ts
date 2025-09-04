import { Controller, Post, Body, HttpException, HttpStatus, Get, Query, Put, Param } from '@nestjs/common';
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
    

    @Get()
    async findAll(@Query() query: any) {
        try {
            const penalties = await this.penaltiesService.findAll(query);
            return penalties;
        } catch (error) {
            throw new HttpException(
                'Error al obtener las penalizaciones',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    @Put(':id')
    async update(@Param('id') id: string, @Body() updateData: any) {
        try {
            const result = await this.penaltiesService.update(id, updateData);
            return {
                message: 'Penalización actualizada exitosamente',
                data: result,
            };
        } catch (error) {
            throw new HttpException(
                'Error al actualizar la penalización',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
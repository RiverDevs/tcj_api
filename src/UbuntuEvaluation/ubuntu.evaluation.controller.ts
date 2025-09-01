import { Controller, Post, Body, Get, Query, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { UbuntuEvaluationService } from './ubuntu.evaluation.service';
import { CreateUbuntuEvaluationDto } from './dto/create-ubuntu-evaluation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ubuntu-evaluations') // Endpoint para el torneo grupal
export class UbuntuEvaluationController {
  constructor(private readonly ubuntuEvaluationService: UbuntuEvaluationService) {}

  @Post()
  async create(@Body() createEvaluationDto: CreateUbuntuEvaluationDto) {
    try {
      return this.ubuntuEvaluationService.create(createEvaluationDto);
    } catch (error) {
      console.error('Error al crear la evaluación:', error);
      throw new InternalServerErrorException('No se pudo crear la evaluación.');
    }
  }

  @Get('final-report')
  async getFinalReport(
    @Query('tournamentId') tournamentId: string,
    @Query('category') category: string,
    @Query('subCategory') subCategory?: string,
  ) {
    if (!tournamentId || !category) {
      throw new InternalServerErrorException('Los parámetros tournamentId y category son requeridos.');
    }
    return this.ubuntuEvaluationService.getFinalReport(tournamentId, category, subCategory);
  }
}
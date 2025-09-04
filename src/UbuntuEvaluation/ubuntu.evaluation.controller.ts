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
  @Get('group-report')
  async getGroupReport(
    @Query('tournamentId') tournamentId: string,
    @Query('category') category: string,
    @Query('subCategory') subCategory: string,
    @Query('pairId') pairId: string,
    @Query('roundNumber') roundNumber: string,
    @Query('judgeIds') judgeIds: string,
  ) {
    if (!tournamentId || !category || !subCategory || !pairId || !roundNumber || !judgeIds) {
      throw new InternalServerErrorException('Todos los parámetros son requeridos.');
    }
    const judgeIdsArray = judgeIds.split(',');
    const roundNumberInt = parseInt(roundNumber, 10);
    if (isNaN(roundNumberInt)) {
      throw new InternalServerErrorException('El número de ronda debe ser un entero.');
    }
    return this.ubuntuEvaluationService.getGroupReport(tournamentId, category, subCategory, pairId, roundNumberInt, judgeIdsArray);
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
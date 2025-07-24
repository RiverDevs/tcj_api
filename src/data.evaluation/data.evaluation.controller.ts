import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { DataEvaluationService } from './data.evaluation.service';
import { CreateDataEvaluationDto } from './dto/create-evaluation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Protege todo el controlador con JWT
@Controller('data-evaluations') // Nuevo endpoint: /api/data-evaluations
export class DataEvaluationController {
  constructor(private readonly dataEvaluationService: DataEvaluationService) {}

  @Post() // Metodo para crear evaluaciones granulares
async create(@Body() createEvaluationDto: CreateDataEvaluationDto) {
  return this.dataEvaluationService.create(createEvaluationDto);
}

  @Get()
  async findAll() {
    return this.dataEvaluationService.findAll();
  }

    @Get('aggregated-scores')
  async getAggregatedScores(
    @Query('tournamentId') tournamentId: string,
    @Query('group') group: string,
    @Query('category') category: string,
    @Query('roundNumber') roundNumber: string, // Recibimos como string, luego lo convertimos a number
    @Query('subCategory') subCategory?: string,
  ) {
    if (!tournamentId || !group || !category || !roundNumber) {
      throw new Error('Parámetros de consulta (tournamentId, group, category, roundNumber) son requeridos.');
    }
    return this.dataEvaluationService.getAggregatedScores(
      tournamentId,
      group,
      category,
      parseInt(roundNumber, 10), // Convertimos a número
      subCategory
    );
  }
}
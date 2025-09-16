import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { FinalPhaseResultsService } from './final-phase-results.service';
import { CreateFinalPhaseResultDto } from './dto/create-final-phase-result.dto';

@Controller('final-phase-results')
export class FinalPhaseResultsController {
  constructor(private readonly finalPhaseResultsService: FinalPhaseResultsService) {}

  @Post()
  async createOrUpdate(@Body() createFinalPhaseResultDto: CreateFinalPhaseResultDto) {
    return this.finalPhaseResultsService.createOrUpdate(createFinalPhaseResultDto);
  }

  // Endpoint para obtener puntajes de una fase específica (opcional) o la suma de todas las fases que coincidan con la consulta.
  @Get(':tournament/scores')
  async getSpecificPhaseScores(
    @Param('tournament') tournament: string,
    @Query('team1') team1: string,
    @Query('team2') team2: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
    @Query('round') round?: string,
  ) {
    return this.finalPhaseResultsService.getFinalResults(tournament, team1, team2, category, subCategory, round);
  }

  // Nuevo endpoint dedicado para obtener la suma de los puntajes de todas las fases (Fase 1, Fase 2, etc.)
  @Get(':tournament/final-combined-scores')
  async getCombinedFinalScores(
    @Param('tournament') tournament: string,
    @Query('team1') team1: string,
    @Query('team2') team2: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
  ) {
    return this.finalPhaseResultsService.getCombinedFinalScores(tournament, team1, team2, category, subCategory);
  }
}
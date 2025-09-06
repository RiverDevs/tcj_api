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

  @Get(':tournament/final-scores')
  async getFinalScores(
    @Param('tournament') tournament: string,
    @Query('team1') team1: string,
    @Query('team2') team2: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
    @Query('judgeTeam') judgeTeam?: string,
  ) {
    return this.finalPhaseResultsService.getFinalResults(tournament, team1, team2, category, subCategory, judgeTeam);
  }
}
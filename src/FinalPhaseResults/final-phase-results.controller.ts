import { Body, Controller, Post, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FinalPhaseResultsService } from './final-phase-results.service';
import { FinalPhaseResult } from './schemas/final-phase-result.schema';
import { CreateFinalPhaseResultDto } from './dto/create-final-phase-result.dto';

@ApiTags('final-phase-results')
@Controller('final-phase-results')
export class FinalPhaseResultsController {
  constructor(private readonly finalPhaseResultsService: FinalPhaseResultsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update a final phase result for a single team' })
  @ApiResponse({ status: 201, description: 'The result has been successfully created/updated.', type: FinalPhaseResult })
  @ApiBody({ type: CreateFinalPhaseResultDto })
  async createOrUpdate(
    @Body() createFinalPhaseResultDto: CreateFinalPhaseResultDto,
  ): Promise<FinalPhaseResult> {
    return this.finalPhaseResultsService.createOrUpdate(createFinalPhaseResultDto);
  }

  @Get('combined-scores')
  @ApiOperation({ summary: 'Get combined scores for two teams across all phases' })
  @ApiResponse({ status: 200, description: 'Combined scores retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - missing team parameters.' })
  @ApiResponse({ status: 404, description: 'Not Found - no results for the specified teams.' })
  async getCombinedFinalScores(
    @Query('tournament') tournament: string,
    @Query('team1') team1: string,
    @Query('team2') team2: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
  ) {
    if (!tournament || !team1 || !team2) {
      throw new NotFoundException('Tournament and two teams must be provided.');
    }
    return this.finalPhaseResultsService.getCombinedFinalScores(tournament, team1, team2, category, subCategory);
  }

  // Endpoint para obtener puntajes de una fase específica.
  @Get('scores-by-round')
  @ApiOperation({ summary: 'Get scores for two teams in a specific round' })
  @ApiResponse({ status: 200, description: 'Scores for the specific round retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Not Found - no results for the specified round.' })
  @ApiQuery({ name: 'round', required: true, description: 'The specific round name' })
  @ApiQuery({ name: 'team1', required: true, description: 'The name of the first team' })
  @ApiQuery({ name: 'team2', required: true, description: 'The name of the second team' })
  @ApiQuery({ name: 'category', required: false, description: 'Optional category filter' })
  @ApiQuery({ name: 'subCategory', required: false, description: 'Optional sub-category filter' })
  async getScoresForRound(
    @Query('tournament') tournament: string,
    @Query('round') round: string,
    @Query('team1') team1: string,
    @Query('team2') team2: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
  ) {
    return this.finalPhaseResultsService.getScoresForRound(tournament, round, team1, team2, category, subCategory);
  }
}
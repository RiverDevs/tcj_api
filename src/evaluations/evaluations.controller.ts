// src/evaluations/evaluations.controller.ts
import { Controller, Post, Body, UseGuards, Req, HttpStatus, HttpCode, Get, Query, BadRequestException, Param, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import { GetScoresQueryDto } from './dto/get-scores-query.dto';
import { Evaluation } from './schemas/evaluation.schema';
import { AdminReportConfigDto } from './dto/admin-report-config.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.JUDGE)
  async create(
   @Body() createEvaluationDto: CreateEvaluationDto,
   @Req() req: Request,
  ): Promise<{ message: string; evaluation: Evaluation }> {
    const userFromToken = req.user as any;
    createEvaluationDto.judge.id = userFromToken._id || userFromToken.id;
    createEvaluationDto.judge.username = userFromToken.username || userFromToken.firstName;

    const evaluation = await this.evaluationsService.createOrUpdate(createEvaluationDto);

    return { message: 'Evaluación guardada exitosamente', evaluation };
  }

  @Post('scores-by-config')
  async findScoresByConfig(@Body() config: AdminReportConfigDto) {
    const queryDto: GetScoresQueryDto = {
      tournamentId: config.tournamentId,
      group: config.group,
      category: config.category,
      subCategory: config.subCategory,
      roundNumber: config.roundNumber,
    };
    return this.evaluationsService.findScores(queryDto);
  }


  @Get('by-criteria') // Ruta completa: /evaluations/by-criteria
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.JUDGE, UserRole.ADMIN)
  async getEvaluationsByCriteria(
    @Query('tournamentId') tournamentId: string,
    @Query('judgeId') judgeId: string,
    @Query('group') group: string,
    @Query('roundNumber') roundNumber: string, // Viene como string del frontend
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
    @Query('resultType') resultType?: string, 
  ) {
    const parsedRoundNumber = parseInt(roundNumber, 10);
    if (isNaN(parsedRoundNumber)) {
      throw new BadRequestException('roundNumber debe ser un número válido.');
    }

    const evaluations = await this.evaluationsService.findEvaluationsByCriteria(
      tournamentId,
      judgeId,
      group,
      parsedRoundNumber,
      category,
      subCategory,
      resultType 
    );
    return { message: 'Evaluaciones obtenidas exitosamente', evaluations };
  }
    // **** NUEVO ENDPOINT: Obtener valores distintos de un campo ****
    @Get('distinct/:field')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
      async getDistinctValues(@Param('field') field: string) {
    try {
        const values = await this.evaluationsService.getDistinctFieldValues(field);
        return { message: `Valores distintos para ${field} obtenidos exitosamente`, data: values };
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }

    /**
     * GET /evaluaciones/scores
     * Obtiene todos los puntajes filtrados por la configuración del torneo.
     * Ejemplo de URL: /evaluaciones/scores?tournamentId=...&group=A&...
     */
    @Get('scores')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getScoresByConfig(@Query() queryScoresDto: GetScoresQueryDto): Promise<Evaluation[]> {
    return this.evaluationsService.findByConfig(queryScoresDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('by-tournament-group-round')
  async findScoresForPlanilla(
    @Query('tournamentId') tournamentId: string,
    @Query('group') group: string,
    @Query('category') category: string,
    @Query('subCategory') subCategory: string,
    @Query('roundNumber', ParseIntPipe) roundNumber: number,
  ): Promise<{ evaluations: Evaluation[] }> {
    const evaluations = await this.evaluationsService.findEvaluationsForPlanilla(
      tournamentId,
      group,
      category,
      subCategory,
      roundNumber,
    );
    return { evaluations };
  }
}

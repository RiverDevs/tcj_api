import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FinalPhaseResult, FinalPhaseResultDocument } from './schemas/final-phase-result.schema';
import { CreateFinalPhaseResultDto } from './dto/create-final-phase-result.dto';

@Injectable()
export class FinalPhaseResultsService {
  constructor(
    @InjectModel(FinalPhaseResult.name) private finalPhaseResultModel: Model<FinalPhaseResultDocument>,
  ) {}

  /**
   * Crea o actualiza el resultado de un solo equipo en una fase específica.
   */
  async createOrUpdate(createFinalPhaseResultDto: CreateFinalPhaseResultDto): Promise<FinalPhaseResult> {
    const { tournament, round, category, subCategory, team, score } = createFinalPhaseResultDto;

    const query = { tournament, round, category, subCategory, team };
    const update = { score };

    const existingResult = await this.finalPhaseResultModel.findOneAndUpdate(
      query,
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return existingResult;
  }

  /**
   * Obtiene y combina los puntajes totales de dos equipos en todas las fases.
   */
  async getCombinedFinalScores(
    tournament: string,
    team1: string,
    team2: string,
    category?: string,
    subCategory?: string,
  ) {
    if (!team1 || !team2) {
      throw new BadRequestException('Debes proporcionar dos equipos para obtener los resultados finales.');
    }

    const queryConditions: any = {
      tournament,
      team: { $in: [team1, team2] },
    };

    if (category) {
      queryConditions.category = category;
    }
    if (subCategory) {
      queryConditions.subCategory = subCategory;
    }

    const allPhaseResults = await this.finalPhaseResultModel.find(queryConditions).exec();

    if (allPhaseResults.length === 0) {
      throw new NotFoundException(`No se encontraron resultados para el torneo: ${tournament}, equipos: ${team1} y ${team2}.`);
    }

    const finalScores: Record<string, number> = {
      [team1]: 0,
      [team2]: 0,
    };

    allPhaseResults.forEach(phaseResult => {
      finalScores[phaseResult.team] += phaseResult.score;
    });

    let winner: string | null = null;
    const score1 = finalScores[team1];
    const score2 = finalScores[team2];

    if (score1 > score2) {
      winner = team1;
    } else if (score2 > score1) {
      winner = team2;
    } else {
      winner = 'Empate';
    }

    return {
      tournament,
      teams: [team1, team2],
      finalScores,
      winner
    };
  }

  /**
   * Obtiene los puntajes de dos equipos para una fase específica.
   */
  async getScoresForRound(
    tournament: string,
    round: string,
    team1: string,
    team2: string,
    category?: string,
    subCategory?: string,
  ) {
    const queryConditions: any = {
      tournament,
      round,
      team: { $in: [team1, team2] },
    };
    
    if (category) {
      queryConditions.category = category;
    }
    if (subCategory) {
      queryConditions.subCategory = subCategory;
    }

    const results = await this.finalPhaseResultModel.find(queryConditions).exec();
    
    if (results.length === 0) {
      throw new NotFoundException(`No se encontraron resultados para el torneo: ${tournament} y fase: ${round}.`);
    }

    const scores: Record<string, number> = {};
    results.forEach(result => {
      scores[result.team] = result.score;
    });

    return {
      round,
      scores,
    };
  }
}
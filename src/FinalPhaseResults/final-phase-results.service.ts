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

  async createOrUpdate(createFinalPhaseResultDto: CreateFinalPhaseResultDto): Promise<FinalPhaseResult> {
    const { tournament, round, results } = createFinalPhaseResultDto;

    const existingResult = await this.finalPhaseResultModel.findOneAndUpdate(
      { tournament, round },
      { $set: { results } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return existingResult;
  }

  async getFinalResults(
    tournament: string,
    team1: string,
    team2: string,
    category?: string,
    subCategory?: string,
    judgeTeam?: string,
  ) {
    if (!team1 || !team2) {
      throw new BadRequestException('Debes proporcionar dos equipos para obtener los resultados finales.');
    }

    // Construir la consulta de forma dinámica
    const queryConditions: any = {
      tournament,
      [`results.${team1}`]: { $exists: true },
      [`results.${team2}`]: { $exists: true },
    };

    if (category) {
      queryConditions.category = category;
    }
    if (subCategory) {
      queryConditions.subCategory = subCategory;
    }
    if (judgeTeam) {
      queryConditions.judgeTeam = judgeTeam;
    }

    // Buscar los resultados filtrados
    const allPhaseResults = await this.finalPhaseResultModel.find(queryConditions).exec();

    if (allPhaseResults.length === 0) {
      throw new NotFoundException(`No se encontraron resultados para el torneo: ${tournament}`);
    }

    const finalScores: Record<string, number> = {};

    // Sumar los puntajes de solo los dos equipos proporcionados
    allPhaseResults.forEach(phaseResult => {
      if (phaseResult.results[team1] !== undefined) {
        if (!finalScores[team1]) finalScores[team1] = 0;
        finalScores[team1] += phaseResult.results[team1];
      }
      if (phaseResult.results[team2] !== undefined) {
        if (!finalScores[team2]) finalScores[team2] = 0;
        finalScores[team2] += phaseResult.results[team2];
      }
    });

    let winner: string | null = null;
    let highestScore = -Infinity;
    const teamNames = Object.keys(finalScores);
    
    // Determinar el equipo ganador
    if (teamNames.length > 0) {
      teamNames.forEach(team => {
          if (finalScores[team] > highestScore) {
              highestScore = finalScores[team];
              winner = team;
          }
      });
    }

    // Manejar el caso de un empate
    const winners = teamNames.filter(team => finalScores[team] === highestScore);
    if (winners.length > 1) {
        winner = `Empate entre ${winners.join(' y ')}`;
    }

    return {
      tournament,
      teams: [team1, team2],
      finalScores,
      winner
    };
  }
}
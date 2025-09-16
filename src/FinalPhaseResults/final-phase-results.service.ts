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
    const { tournament, round, category, subCategory, teams, results } = createFinalPhaseResultDto;

    const existingResult = await this.finalPhaseResultModel.findOneAndUpdate(
      { tournament, round, category, subCategory, teams },
      { $set: { results } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return existingResult;
  }

  // Nueva función para obtener el total de puntajes de todas las fases
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

    const teamsString1 = `${team1}-${team2}`;
    const teamsString2 = `${team2}-${team1}`;

    const queryConditions: any = {
      tournament,
      $or: [{ teams: teamsString1 }, { teams: teamsString2 }],
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

    const finalScores: Record<string, number> = {};
    finalScores[team1] = 0;
    finalScores[team2] = 0;

    allPhaseResults.forEach(phaseResult => {
      if (phaseResult.results[team1] !== undefined) {
        finalScores[team1] += phaseResult.results[team1];
      }
      if (phaseResult.results[team2] !== undefined) {
        finalScores[team2] += phaseResult.results[team2];
      }
    });

    let winner: string | null = null;
    let highestScore = -Infinity;
    const teamNames = Object.keys(finalScores);
    
    // Determinar el equipo ganador o si es un empate
    if (teamNames.length > 0) {
      const score1 = finalScores[team1];
      const score2 = finalScores[team2];
      if (score1 > score2) {
        winner = team1;
      } else if (score2 > score1) {
        winner = team2;
      } else {
        winner = 'Empate';
      }
    }

    return {
      tournament,
      teams: [team1, team2],
      finalScores,
      winner
    };
  }

  // Función original, modificada para aceptar un 'round' opcional
  async getFinalResults(
    tournament: string,
    team1: string,
    team2: string,
    category?: string,
    subCategory?: string,
    round?: string,
  ) {
    if (!team1 || !team2) {
      throw new BadRequestException('Debes proporcionar dos equipos para obtener los resultados finales.');
    }

    const teamsString1 = `${team1}-${team2}`;
    const teamsString2 = `${team2}-${team1}`;

    const queryConditions: any = {
      tournament,
      $or: [{ teams: teamsString1 }, { teams: teamsString2 }],
    };

    if (category) {
      queryConditions.category = category;
    }
    if (subCategory) {
      queryConditions.subCategory = subCategory;
    }
    // Si se proporciona una ronda, la añadimos a la consulta
    if (round) {
      queryConditions.round = round;
    }

    const allPhaseResults = await this.finalPhaseResultModel.find(queryConditions).exec();

    if (allPhaseResults.length === 0) {
      throw new NotFoundException(`No se encontraron resultados para el torneo: ${tournament} y equipos: ${team1}, ${team2}.`);
    }

    const finalScores: Record<string, number> = {};
    finalScores[team1] = 0;
    finalScores[team2] = 0;

    allPhaseResults.forEach(phaseResult => {
      if (phaseResult.results[team1] !== undefined) {
        finalScores[team1] += phaseResult.results[team1];
      }
      if (phaseResult.results[team2] !== undefined) {
        finalScores[team2] += phaseResult.results[team2];
      }
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
}
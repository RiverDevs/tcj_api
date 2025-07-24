// src/data.evaluation/data.evaluation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GranularEvaluation, GranularEvaluationDocument } from './schemas/granular-evaluation.schema';
import { CreateDataEvaluationDto } from './dto/create-evaluation.dto';

@Injectable()
export class DataEvaluationService {
  constructor(
    @InjectModel(GranularEvaluation.name) private granularEvaluationModel: Model<GranularEvaluationDocument>,
  ) {}

  /**
   * Crea una nueva evaluación granular en la base de datos.
   * @param createEvaluationDto Los datos para crear la evaluación.
   * @returns La evaluación granular creada.
   */
  async create(createEvaluationDto: CreateDataEvaluationDto): Promise<GranularEvaluation> {
    const createdEvaluation = new this.granularEvaluationModel(createEvaluationDto);
    return createdEvaluation.save();
  }

  /**
   * Obtiene todas las evaluaciones granulares de la base de datos.
   * @returns Un array de todas las evaluaciones granulares.
   */
  async findAll(): Promise<GranularEvaluation[]> {
    return this.granularEvaluationModel.find().exec();
  }

  /**
   * Busca evaluaciones granulares por criterios de torneo y ronda.
   * @param tournamentId ID del torneo.
   * @param group Grupo del torneo.
   * @param category Categoría del torneo.
   * @param roundNumber Número de la ronda.
   * @param vuelta (Opcional) La vuelta específica de la evaluación.
   * @param judgeId (Opcional) ID del juez.
   * @returns Un array de evaluaciones granulares que coinciden con los criterios.
   */
  async findByTournamentAndRound(
    tournamentId: string,
    group: string,
    category: string,
    roundNumber: number,
    vuelta?: number,
    judgeId?: string
  ): Promise<GranularEvaluation[]> {
    const query: any = {
      tournamentId,
      group,
      category,
      roundNumber: Number(roundNumber),
    };

    if (vuelta !== undefined) {
      query.vuelta = Number(vuelta);
    }
    if (judgeId) {
      query.judgeId = judgeId;
    }

    return this.granularEvaluationModel.find(query).exec();
  }

  /**
   * Obtiene los scores agregados por competidor y por juez para una configuración específica.
   * Suma los scores de todas las vueltas para cada competidor y juez, restando las penalizaciones.
   * @param tournamentId ID del torneo.
   * @param group Grupo del torneo.
   * @param category Categoría del torneo.
   * @param roundNumber Número de la ronda.
   * @param subCategory (Opcional) Subcategoría del torneo.
   * @returns Un array de objetos con los scores agregados.
   */
  async getAggregatedScores(
    tournamentId: string,
    group: string,
    category: string,
    roundNumber: number,
    subCategory?: string
  ): Promise<any[]> {
    const matchStage: any = {
      tournamentId,
      group,
      category,
      roundNumber: Number(roundNumber),
    };

    if (subCategory) {
      matchStage.subCategory = subCategory;
    }

    try {
      const aggregatedData = await this.granularEvaluationModel.aggregate([
        {
          $match: matchStage
        },
        {
          $group: {
            _id: {
              competitorNumber: "$competitorNumber",
              judgeId: "$judgeId",
              judgeUsername: "$judgeUsername"
            },
            // --- CAMBIO CLAVE AQUÍ: Lógica condicional para sumar/restar ---
            totalScoreByJudge: {
              $sum: {
                $cond: {
                  if: { $eq: ["$type", "Penalización"] }, // Si el tipo es "Penalización"
                  then: { $multiply: ["$value", -1] }, // Resta el valor (multiplica por -1)
                  else: "$score" // De lo contrario, suma el score normal
                }
              }
            }
            // --- FIN CAMBIO CLAVE ---
          }
        },
        {
          $group: {
            _id: "$_id.competitorNumber",
            judgesScores: {
              $push: {
                judgeId: "$_id.judgeId",
                judgeUsername: "$_id.judgeUsername",
                score: "$totalScoreByJudge" // Este score ahora incluirá las penalizaciones restadas
              }
            },
            overallTotalScore: { $sum: "$totalScoreByJudge" } // Suma el total general del competidor
          }
        },
        {
          $project: {
            _id: 0,
            competitorNumber: "$_id",
            judgesScores: 1,
            overallTotalScore: 1
          }
        },
        {
          $sort: { competitorNumber: 1 }
        }
      ]).exec();

      return aggregatedData;

    } catch (error) {
      console.error('Error durante la agregación de scores:', error);
      throw new Error('No se pudieron obtener los scores agregados.');
    }
  }
}
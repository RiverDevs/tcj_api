import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UbuntuEvaluation, UbuntuEvaluationDocument } from './schemas/ubuntu-evaluation.schema';
import { CreateUbuntuEvaluationDto } from './dto/create-ubuntu-evaluation.dto';

@Injectable()
export class UbuntuEvaluationService {
  constructor(
    @InjectModel(UbuntuEvaluation.name) private ubuntuEvaluationModel: Model<UbuntuEvaluationDocument>,
  ) {}

  /**
   * Crea una nueva evaluación de equipos en la base de datos.
   * @param createEvaluationDto Los datos para crear la evaluación.
   * @returns La evaluación de equipo creada.
   */
  async create(createEvaluationDto: CreateUbuntuEvaluationDto): Promise<UbuntuEvaluation> {
    const createdEvaluation = new this.ubuntuEvaluationModel(createEvaluationDto);
    return createdEvaluation.save();
  }

  /**
   * Obtiene el reporte final sumando los scores de todas las rondas y penalizaciones por equipo.
   * @param tournamentId ID del torneo.
   * @param category Categoría del torneo.
   * @param subCategory (Opcional) Subcategoría del torneo.
   * @returns Un objeto con los resultados finales, incluyendo los scores totales por equipo y por juez.
   */
  async getFinalReport(
    tournamentId: string,
    category: string,
    subCategory?: string,
  ): Promise<any> {
    const matchStage: any = {
      tournamentId,
      category,
    };
    if (subCategory) {
      matchStage.subCategory = subCategory;
    }

    try {
      const aggregatedData = await this.ubuntuEvaluationModel.aggregate([
        {
          $match: matchStage,
        },
        {
          $unwind: '$teamScores',
        },
        {
          $unwind: {
            path: '$penalties',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$teamScores.teamName',
            totalScore: {
              $sum: '$teamScores.score',
            },
            totalPenalties: {
              $sum: {
                $cond: {
                  if: { $eq: ['$penalties.teamName', '$teamScores.teamName'] },
                  then: '$penalties.value',
                  else: 0,
                },
              },
            },
            judgeScores: {
              $push: {
                judgeUsername: '$judgeUsername',
                score: '$teamScores.score',
                penalties: {
                  $cond: {
                    if: { $eq: ['$penalties.teamName', '$teamScores.teamName'] },
                    then: '$penalties.value',
                    else: 0,
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            teamName: '$_id',
            finalScore: { $subtract: ['$totalScore', '$totalPenalties'] },
            judgeScores: 1,
          },
        },
        {
          $sort: { finalScore: -1 },
        },
      ]).exec();
      
      return aggregatedData;
    } catch (error) {
      console.error('Error al generar el reporte final para el torneo grupal:', error);
      throw new InternalServerErrorException('No se pudieron obtener los resultados del reporte final.');
    }
  }

  // Puedes agregar otros métodos si los necesitas en el futuro, como findAll
  async findAll(): Promise<UbuntuEvaluation[]> {
    return this.ubuntuEvaluationModel.find().exec();
  }
}
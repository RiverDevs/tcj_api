// src/evaluations/evaluations.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { Evaluation, EvaluationDocument } from './schemas/evaluation.schema';
import { EvaluationResponseDto } from './dto/evaluation-response.dto';
import { GetScoresQueryDto } from './dto/get-scores-query.dto';


@Injectable()
export class EvaluationsService {
    constructor(
        @InjectModel(Evaluation.name) private evaluationModel: Model<EvaluationDocument>,
    ) {}

    async create(createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
        const formattedDto = {
            ...createEvaluationDto,
            tournamentId: new Types.ObjectId(createEvaluationDto.tournamentId),
            judge: {
                ...createEvaluationDto.judge,
                id: new Types.ObjectId(createEvaluationDto.judge.id)
            }
        };
        const createdEvaluation = new this.evaluationModel(formattedDto);
        return createdEvaluation.save();
    }

    async createOrUpdate(createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
        const formattedDto = {
            ...createEvaluationDto,
            tournamentId: new Types.ObjectId(createEvaluationDto.tournamentId),
            judge: {
                ...createEvaluationDto.judge,
                id: new Types.ObjectId(createEvaluationDto.judge.id)
            }
        };

        const filter = {
            tournamentId: formattedDto.tournamentId,
            'judge.id': formattedDto.judge.id,
            group: formattedDto.group,
            category: formattedDto.category,
            subCategory: formattedDto.subCategory,
            roundNumber: formattedDto.roundNumber,
            'pair.id': formattedDto.pair.id,
        };

        const updatedEvaluation = await this.evaluationModel.findOneAndUpdate(
            filter,
            { $set: formattedDto },
            { new: true, upsert: true, runValidators: true }
        ).exec();

        return updatedEvaluation;
    }

    async findAll(): Promise<Evaluation[]> {
        return this.evaluationModel.find().exec();
    }

    async findEvaluationsByCriteria(
    tournamentId: string,
    judgeId: string,
    group: string,
    roundNumber: number,
    category?: string,
    subCategory?: string,
    resultType?: string, 
  ): Promise<Evaluation[]> {
    const filters: any = {
      tournamentId: new Types.ObjectId(tournamentId),
      'judge.id': new Types.ObjectId(judgeId),
      group: group,
      roundNumber: roundNumber,
    };

    if (category) {
        filters.category = category;
    }
    if (subCategory) {
        filters.subCategory = subCategory;
    }
    if (resultType) { 
        filters.resultType = resultType;
    }

    return this.evaluationModel.find(filters)
      .sort({ evaluatedAt: -1 })
      .exec();
    }

    async getDistinctFieldValues(field: string): Promise<any[]> {
        const allowedFields = ['tournamentName', 'group', 'category', 'subCategory', 'roundNumber'];
        if (!allowedFields.includes(field)) {
            throw new Error(`Campo no permitido para consulta distinct: ${field}`);
        }
        if (field === 'roundNumber') {
            const distinctValues = await this.evaluationModel.distinct(field).exec();
            return distinctValues
                .map(value => typeof value === 'string' ? parseInt(value, 10) : value)
                .sort((a, b) => a - b);
        }
        return this.evaluationModel.distinct(field).exec();
    }

    async findScores(query: GetScoresQueryDto): Promise<EvaluationResponseDto[]> {
        const { tournamentId, group, category, subCategory, roundNumber } = query;

        const parsedRoundNumber = typeof roundNumber === 'string' ? parseInt(roundNumber, 10) : roundNumber;

        const evaluations = await this.evaluationModel.find({
            tournamentId,
            group,
            category,
            subCategory,
            roundNumber: parsedRoundNumber,
        })
            .exec();

        return evaluations.map(evalDoc => ({
            _id: (evalDoc._id as Types.ObjectId).toString(),
            atletaId: evalDoc.pair.competitor1,
            juezId: evalDoc.judge ? evalDoc.judge.id.toString() : '',
            scoreCompetitor1: evalDoc.scoreCompetitor1,
            scoreCompetitor2: evalDoc.scoreCompetitor2,
        }));
    }

    async findByConfig(queryScoresDto: GetScoresQueryDto): Promise<Evaluation[]> {
        const { roundNumber, ...restOfQuery } = queryScoresDto;

        const filter: any = {
            ...restOfQuery,
            roundNumber: typeof roundNumber === 'string' ? parseInt(roundNumber, 10) : roundNumber,
        };

        const scores = await this.evaluationModel.find(filter).exec();

        if (!scores) {
            throw new NotFoundException('No se encontraron evaluaciones con los criterios especificados.');
        }

        const mappedScores: Evaluation[] = scores.map((doc: any) => ({
            ...doc.toObject(),
        }));

        return mappedScores;
    }

    // **** VERSIÓN FINAL PARA LA PLANILLA EXTENDIDA ****
    async findEvaluationsForPlanilla(
        tournamentId: string,
        group: string,
        category: string,
        subCategory: string,
        roundNumber: number,
    ): Promise<EvaluationDocument[]> {
        const evaluations = await this.evaluationModel.find({
            tournamentId: tournamentId,
            group: group,
            category: category,
            subCategory: subCategory,
            roundNumber: roundNumber,
        })
            .exec();

        return evaluations;
    }
}

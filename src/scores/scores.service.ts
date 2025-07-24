// src/scores/scores.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Score, ScoreDocument } from './schemas/score.schema';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Match, MatchDocument } from '../matches/schemas/match.schema';
import { Competitor, CompetitorDocument } from '../competitors/schemas/competitor.schema';
import { Judge, JudgeDocument } from '../judges/schemas/judge.schema';
import { AssignScoreDto } from './dto/assign-score.dto';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel(Score.name) private readonly scoreModel: Model<ScoreDocument>,
    @InjectModel(Match.name) private readonly matchModel: Model<MatchDocument>,
    @InjectModel(Competitor.name) private readonly competitorModel: Model<CompetitorDocument>,
    @InjectModel(Judge.name) private readonly judgeModel: Model<JudgeDocument>,
  ) {}

  private async validateReferences(matchId: string, competitorId: string, judgeId: string): Promise<void> {
    if (!Types.ObjectId.isValid(matchId)) {
      throw new BadRequestException(`ID de partido inválido: ${matchId}`);
    }
    const matchExists = await this.matchModel.findById(matchId).exec();
    if (!matchExists) {
      throw new NotFoundException(`Partido con ID "${matchId}" no encontrado.`);
    }

    if (!Types.ObjectId.isValid(competitorId)) {
      throw new BadRequestException(`ID de competidor inválido: ${competitorId}`);
    }
    const competitorExists = await this.competitorModel.findById(competitorId).exec();
    if (!competitorExists) {
      throw new NotFoundException(`Competidor con ID "${competitorId}" no encontrado.`);
    }

    if (!Types.ObjectId.isValid(judgeId)) {
      throw new BadRequestException(`ID de juez inválido: ${judgeId}`);
    }
    const judgeExists = await this.judgeModel.findById(judgeId).exec();
    if (!judgeExists) {
      throw new NotFoundException(`Juez con ID "${judgeId}" no encontrado.`);
    }

    // Opcional: Validar que el competidor y el juez realmente pertenecen al partido
    // Esto sería una lógica más avanzada para asegurar la integridad de los datos.
    // const matchWithRelations = await this.matchModel.findById(matchId).populate('competitors').populate('judges').exec();
    // if (!matchWithRelations.competitors.some(c => c._id.equals(competitorId))) {
    //   throw new BadRequestException('El competidor no participa en este partido.');
    // }
    // if (!matchWithRelations.judges.some(j => j._id.equals(judgeId))) {
    //   throw new BadRequestException('El juez no está asignado a este partido.');
    // }
  }

  async create(createScoreDto: CreateScoreDto): Promise<Score> {
    await this.validateReferences(
      createScoreDto.match,
      createScoreDto.competitor,
      createScoreDto.judge,
    );
    const createdScore = new this.scoreModel(createScoreDto);
    return createdScore.save();
  }

  async findAll(): Promise<Score[]> {
    return this.scoreModel
      .find()
      .populate('match')
      .populate('competitor')
      .populate('judge')
      .exec();
  }

  async findOne(id: string): Promise<Score> {
    const score = await this.scoreModel
      .findById(id)
      .populate('match')
      .populate('competitor')
      .populate('judge')
      .exec();
    if (!score) {
      throw new NotFoundException(`Puntuación con ID "${id}" no encontrada.`);
    }
    return score;
  }

  async update(id: string, updateScoreDto: UpdateScoreDto): Promise<Score> {
    // Validar referencias solo si se proporcionan en el DTO de actualización
    if (updateScoreDto.match || updateScoreDto.competitor || updateScoreDto.judge) {
        // Podrías obtener el Score actual para revalidar solo las referencias que cambian
        // const currentScore = await this.scoreModel.findById(id).exec();
        // await this.validateReferences(
        //     updateScoreDto.match || currentScore.match.toString(),
        //     updateScoreDto.competitor || currentScore.competitor.toString(),
        //     updateScoreDto.judge || currentScore.judge.toString(),
        // );
        // Por simplicidad, aquí asumimos que si se envía una referencia, se valida individualmente.
        if (updateScoreDto.match && !Types.ObjectId.isValid(updateScoreDto.match)) throw new BadRequestException(`ID de partido inválido: ${updateScoreDto.match}`);
        if (updateScoreDto.competitor && !Types.ObjectId.isValid(updateScoreDto.competitor)) throw new BadRequestException(`ID de competidor inválido: ${updateScoreDto.competitor}`);
        if (updateScoreDto.judge && !Types.ObjectId.isValid(updateScoreDto.judge)) throw new BadRequestException(`ID de juez inválido: ${updateScoreDto.judge}`);
    }

    const updatedScore = await this.scoreModel
      .findByIdAndUpdate(id, updateScoreDto, { new: true })
      .exec();
    if (!updatedScore) {
      throw new NotFoundException(`Puntuación con ID "${id}" no encontrada para actualizar.`);
    }
    return updatedScore;
  }

  async assign(assignScoreDto: AssignScoreDto, judgeId: string): Promise<Score> {
    const { competitorId, score } = assignScoreDto;

    const competitorExists = await this.competitorModel.findById(competitorId).exec();
    if (!competitorExists) {
      throw new NotFoundException(`Competidor con ID "${competitorId}" no encontrado.`);
    }

    const newScore = new this.scoreModel({
      competitor: competitorId,
      judge: judgeId,
      score,
    });

    return newScore.save();
  }
}




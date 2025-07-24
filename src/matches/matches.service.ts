// src/matches/matches.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Tournament, TournamentDocument } from '../tournaments/schemas/tournament.schema';
import { Competitor, CompetitorDocument } from '../competitors/schemas/competitor.schema';
import { CategoryEnum } from '../categories/enums/category.enum';
import { Judge, JudgeDocument} from '../judges/schemas/judge.schema';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private readonly matchModel: Model<MatchDocument>,
    @InjectModel(Tournament.name) private readonly tournamentModel: Model<TournamentDocument>,
    @InjectModel(Competitor.name) private readonly competitorModel: Model<CompetitorDocument>,
    @InjectModel(Judge.name) private readonly judgeModel: Model<JudgeDocument>,
  ) {}

  private async validateReferences(
    tournamentId: string,
    categoryId: string,
    competitorIds: string[],
    judgeIds: string[],
  ): Promise<void> {
    if (!Types.ObjectId.isValid(tournamentId)) {
      throw new BadRequestException(`ID de torneo inválido: ${tournamentId}`);
    }
    const tournamentExists = await this.tournamentModel.findById(tournamentId).exec();
    if (!tournamentExists) {
      throw new NotFoundException(`Torneo con ID "${tournamentId}" no encontrado.`);
    }

    if (!Object.values(CategoryEnum).includes(categoryId as CategoryEnum)) {
    throw new BadRequestException(`Categoría "${categoryId}" no es válida.`);
    }

    if (!competitorIds || competitorIds.length !== 2) {
      throw new BadRequestException('Se requieren exactamente 2 IDs de competidores.');
    }
    for (const compId of competitorIds) {
      if (!Types.ObjectId.isValid(compId)) {
        throw new BadRequestException(`ID de competidor inválido: ${compId}`);
      }
    }
    const existingCompetitors = await this.competitorModel.find({ _id: { $in: competitorIds } });
    if (existingCompetitors.length !== competitorIds.length) {
      throw new NotFoundException('Una o más IDs de competidores no son válidas o no existen.');
    }

    if (!judgeIds || judgeIds.length === 0) {
      throw new BadRequestException('Se requiere al menos un ID de juez.');
    }
    for (const judgeId of judgeIds) {
      if (!Types.ObjectId.isValid(judgeId)) {
        throw new BadRequestException(`ID de juez inválido: ${judgeId}`);
      }
    }
    const existingJudges = await this.judgeModel.find({ _id: { $in: judgeIds } });
    if (existingJudges.length !== judgeIds.length) {
      throw new NotFoundException('Una o más IDs de jueces no son válidas o no existen.');
    }
  }

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    await this.validateReferences(
      createMatchDto.tournament,
      createMatchDto.category,
      createMatchDto.competitors,
      createMatchDto.judges,
    );
    const createdMatch = new this.matchModel(createMatchDto);
    return createdMatch.save();
  }

  async findAll(): Promise<Match[]> {
  return this.matchModel
    .find()
    .populate('tournament')
    .populate('competitors')
    .populate('judges')
    .exec();
}

async findOne(id: string): Promise<Match> {
  const match = await this.matchModel
    .findById(id)
    .populate('tournament')
    .populate('competitors')
    .populate('judges')
    .exec();
  if (!match) {
    throw new NotFoundException(`Partido con ID "${id}" no encontrado.`);
  }
  return match;
}


  async update(id: string, updateMatchDto: UpdateMatchDto): Promise<Match> {
    // Validar referencias solo si se proporcionan en el DTO de actualización
    if (updateMatchDto.tournament || updateMatchDto.category || updateMatchDto.competitors || updateMatchDto.judges) {
        // Para simplificar, si se envía cualquier ID referenciado, revalidamos todos los que se envíen.
        // Podrías hacer validaciones más granulares si lo necesitas.
        // Fetch the existing match to safely access its properties
        const existingMatch = await this.matchModel.findById(id)
          .select('tournament category competitors judges')
          .exec();
        if (!existingMatch) {
          throw new NotFoundException(`Partido con ID "${id}" no encontrado para actualizar referencias.`);
        }
        await this.validateReferences(
            updateMatchDto.tournament || existingMatch.tournament.toString(),
            updateMatchDto.category || existingMatch.category.toString(),
            updateMatchDto.competitors || existingMatch.competitors.map((c: any) => c.toString()),
            updateMatchDto.judges || existingMatch.judges.map((j: any) => j.toString()),
        );
    }
    
    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(id, updateMatchDto, { new: true })
      .exec();
    if (!updatedMatch) {
      throw new NotFoundException(`Partido con ID "${id}" no encontrado para actualizar.`);
    }
    return updatedMatch;
  }

  async remove(id: string): Promise<any> {
    const deletedMatch = await this.matchModel.findByIdAndDelete(id).exec();
    if (!deletedMatch) {
      throw new NotFoundException(`Partido con ID "${id}" no encontrado para eliminar.`);
    }
    // Consideración: Al eliminar un Match, ¿deberíamos eliminar sus Scores asociados?
    // Por ahora, solo elimina el Match. Luego podemos añadir esa lógica.
    return { message: `Partido con ID "${id}" eliminado correctamente.` };
  }
}

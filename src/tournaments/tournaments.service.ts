// src/tournaments/tournaments.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tournament, TournamentDocument } from './schemas/tournament.schema';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Judge, JudgeDocument } from '../judges/schemas/judge.schema';
import { CategoryEnum } from '../competitors/enums/category.enum'; // asegúrate de importar el enum

@Injectable()
export class TournamentsService {
  constructor(
    @InjectModel(Tournament.name) private readonly tournamentModel: Model<TournamentDocument>,
    @InjectModel(Judge.name) private readonly judgeModel: Model<JudgeDocument>,         // Inyectar Judge Model
  ) {}

    private async validateReferences(categoryIds: string[] | undefined, judgeIds: string[] | undefined): Promise<void> {
      if (categoryIds && categoryIds.length > 0) {
        for (const category of categoryIds) {
      if (!Object.values(CategoryEnum).includes(category as CategoryEnum)) {
        throw new BadRequestException(`Categoría inválida: "${category}"`);
        }
      }
    }

  if (judgeIds && judgeIds.length > 0) {
    const existingJudges = await this.judgeModel.find({ _id: { $in: judgeIds } });
    if (existingJudges.length !== judgeIds.length) {
      throw new BadRequestException('Una o más IDs de jueces no son válidas.');
    }
  }
}


  async create(createTournamentDto: CreateTournamentDto): Promise<Tournament> {
    await this.validateReferences(createTournamentDto.categories, createTournamentDto.judges);
    const createdTournament = new this.tournamentModel(createTournamentDto);
    return createdTournament.save();
  }

  async findAll(): Promise<Tournament[]> {
    return this.tournamentModel
      .find()
      .populate('judges')     // Popula los objetos completos de juez
      .exec();
  }

  async findOne(id: string): Promise<Tournament> {
    const tournament = await this.tournamentModel
      .findById(id)
      .populate('judges')
      .exec();
    if (!tournament) {
      throw new NotFoundException(`Torneo con ID "${id}" no encontrado.`);
    }
    return tournament;
  }

  async update(id: string, updateTournamentDto: UpdateTournamentDto): Promise<Tournament> {
    await this.validateReferences(updateTournamentDto.categories, updateTournamentDto.judges);

    const updatedTournament = await this.tournamentModel
      .findByIdAndUpdate(id, updateTournamentDto, { new: true })
      .exec();
    if (!updatedTournament) {
      throw new NotFoundException(`Torneo con ID "${id}" no encontrado para actualizar.`);
    }
    return updatedTournament;
  }

  async remove(id: string): Promise<any> {
    const deletedTournament = await this.tournamentModel.findByIdAndDelete(id).exec();
    if (!deletedTournament) {
      throw new NotFoundException(`Torneo con ID "${id}" no encontrado para eliminar.`);
    }
    return { message: `Torneo con ID "${id}" eliminado correctamente.` };
  }
}

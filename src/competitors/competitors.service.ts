// src/competitors/competitors.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Competitor, CompetitorDocument } from './schemas/competitor.schema';
import { CreateCompetitorDto } from './dto/create-competitor.dto';
import { UpdateCompetitorDto } from './dto/update-competitor.dto';

@Injectable()
export class CompetitorsService {
  constructor(
    @InjectModel(Competitor.name) private readonly competitorModel: Model<CompetitorDocument>,
  ) {}

  async create(createCompetitorDto: CreateCompetitorDto): Promise<Competitor> {
    const createdCompetitor = new this.competitorModel(createCompetitorDto);
    return createdCompetitor.save();
  }

  async findAll(): Promise<Competitor[]> {
    return this.competitorModel.find().exec();
  }

  async findOne(id: string): Promise<Competitor> {
    const competitor = await this.competitorModel.findById(id).exec();
    if (!competitor) {
      throw new NotFoundException(`Competidor con ID "${id}" no encontrado.`);
    }
    return competitor;
  }

  async update(id: string, updateCompetitorDto: UpdateCompetitorDto): Promise<Competitor> {
    const updatedCompetitor = await this.competitorModel
      .findByIdAndUpdate(id, updateCompetitorDto, { new: true })
      .exec();

    if (!updatedCompetitor) {
      throw new NotFoundException(`Competidor con ID "${id}" no encontrado para actualizar.`);
    }

    return updatedCompetitor;
  }

  async remove(id: string): Promise<any> {
    const deletedCompetitor = await this.competitorModel.findByIdAndDelete(id).exec();
    if (!deletedCompetitor) {
      throw new NotFoundException(`Competidor con ID "${id}" no encontrado para eliminar.`);
    }
    return { message: `Competidor con ID "${id}" eliminado correctamente.` };
  }

  async findMyProfile(userId: string): Promise<Competitor> {
    const competitor = await this.competitorModel.findOne({ user: userId }).exec();
    if (!competitor) {
      throw new NotFoundException(`No se encontró un perfil de competidor para el usuario con ID "${userId}".`);
    }
    return competitor;
  }
}


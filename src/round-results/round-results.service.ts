// src/round-results/round-results.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoundResult, RoundResultDocument } from './schemas/round-result.schema';
import { CreateRoundResultDto } from './dto/create-round-result.dto';

@Injectable()
export class RoundResultsService {
  constructor(
    @InjectModel(RoundResult.name) private roundResultModel: Model<RoundResultDocument>,
  ) {}

  async create(createRoundResultDto: CreateRoundResultDto): Promise<RoundResult> {
    // Opcional: Podrías añadir lógica aquí para verificar si ya existe un resultado
    // para esta combinación de torneo, grupo, categoría, ronda, subcategoría
    // y si es así, actualizarlo en lugar de crear uno nuevo.
    // Por ahora, solo crea uno nuevo.
    const createdResult = new this.roundResultModel(createRoundResultDto);
    return createdResult.save();
  }

  // Puedes añadir otros métodos aquí si necesitas buscar, actualizar o eliminar resultados finales
  async findOneByConfig(tournamentId: string, group: string, category: string, roundNumber: number, subCategory?: string): Promise<RoundResult | null> {
    const query: any = { tournamentId, group, category, roundNumber };
    if (subCategory) {
      query.subCategory = subCategory;
    }
    return this.roundResultModel.findOne(query).exec();
  }

  async update(id: string, updateRoundResultDto: CreateRoundResultDto): Promise<RoundResult | null> {
    return this.roundResultModel.findByIdAndUpdate(id, updateRoundResultDto, { new: true }).exec();
  }
}
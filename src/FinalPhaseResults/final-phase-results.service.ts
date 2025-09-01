import { Injectable } from '@nestjs/common';
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

    // Buscar si ya existe un resultado para este torneo y fase
    const existingResult = await this.finalPhaseResultModel.findOneAndUpdate(
      { tournament, round },
      { $set: { results } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return existingResult;
  }
}
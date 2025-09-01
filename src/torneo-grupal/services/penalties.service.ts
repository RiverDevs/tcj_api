// src/torneo-grupal/services/penalties.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePenaltyDto } from '../dto/create-penalty.dto';
import { Penalty, PenaltyDocument } from '../schemas/penalty.schema';

@Injectable()
export class PenaltiesService {
    constructor(@InjectModel(Penalty.name) private penaltyModel: Model<PenaltyDocument>) {}

    async create(createPenaltyDto: CreatePenaltyDto): Promise<Penalty> {
        const createdPenalty = new this.penaltyModel(createPenaltyDto);
        return createdPenalty.save();
    }
}
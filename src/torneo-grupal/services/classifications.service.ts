// src/torneo-grupal/services/classifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClassificationDto } from '../dto/create-classification.dto';
import { Classification, ClassificationDocument } from '../schemas/classification.schema';

@Injectable()
export class ClassificationsService {
    constructor(@InjectModel(Classification.name) private classificationModel: Model<ClassificationDocument>) {}

    async create(createClassificationDto: CreateClassificationDto): Promise<Classification> {
        const createdClassification = new this.classificationModel(createClassificationDto);
        return createdClassification.save();
    }
}
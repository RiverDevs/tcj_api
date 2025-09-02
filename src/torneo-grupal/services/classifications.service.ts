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
    
    async findAll(query: any): Promise<Classification[]> {
        // Construir el objeto de filtro dinámicamente
        const filter = {};
        if (query.torneo) {
            filter['torneo'] = query.torneo;
        }
        if (query.categoria) {
            filter['categoria'] = query.categoria;
        }
        if (query.subcategoria) {
            filter['subcategoria'] = query.subcategoria;
        }
        if (query.fase) {
            filter['fase'] = query.fase;
        }
        if (query.equipos) {
            filter['equipos'] = query.equipos;
        }
        if (query.equipoJueces) {
            filter['equipoJueces'] = { $in: query.equipoJueces.split(',') };
        }
        
        return this.classificationModel.find(filter).exec();
    }
}
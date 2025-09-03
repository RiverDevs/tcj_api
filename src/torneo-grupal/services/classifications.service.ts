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
        const filter: any = {};
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
        
        // Manejar el filtro de equipos de forma dinámica
        if (query.equipo) {
            const teams = Array.isArray(query.equipo) ? query.equipo : [query.equipo];
            filter['equipo'] = { $in: teams };
        } else if (query.equipos) {
            const teams = query.equipos.split('-').map(t => t.trim());
            filter['equipo'] = { $in: teams };
        }

        if (query.equipoJueces) {
            filter['equipoJueces'] = { $in: query.equipoJueces.split(',') };
        }
        
        return this.classificationModel.find(filter).exec();
    }

    async update(id: string, updateData: any): Promise<Classification> {
        const updatedClassification = await this.classificationModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedClassification) {
            throw new Error('Clasificación no encontrada.');
        }
        return updatedClassification;
    }
}
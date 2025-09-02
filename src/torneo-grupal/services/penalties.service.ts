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

    async findAll(query: any): Promise<Penalty[]> {
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
        
        return this.penaltyModel.find(filter).exec();
    }
}
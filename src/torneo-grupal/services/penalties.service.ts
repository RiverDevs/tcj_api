import { Injectable, NotFoundException } from '@nestjs/common';
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
        if (query.equipos) {
            const teams = query.equipos.split('-').map(t => t.trim());
            filter['equipo'] = { $in: teams };
        }

        if (query.equipoJueces) {
            filter['equipoJueces'] = { $in: query.equipoJueces.split(',') };
        }
        
        return this.penaltyModel.find(filter).exec();
    }

    async update(id: string, updateData: any): Promise<Penalty> {
        const updatedPenalty = await this.penaltyModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedPenalty) {
            throw new NotFoundException('Penalización no encontrada.');
        }
        return updatedPenalty;
    }
}
// src/judges/judges.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Judge, JudgeDocument } from './schemas/judge.schema'; // Asegúrate de que esta ruta sea correcta
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';

@Injectable()
export class JudgesService {
  constructor(
    @InjectModel(Judge.name) private readonly judgeModel: Model<JudgeDocument>,
  ) {}

  async create(createJudgeDto: CreateJudgeDto): Promise<Judge> {
    const createdJudge = new this.judgeModel(createJudgeDto);
    console.log('Juez creado');
    return createdJudge.save();
  }

  async findAll(): Promise<Judge[]> {
    return this.judgeModel.find().exec();
  }

  async findOne(id: string): Promise<Judge> {
    const judge = await this.judgeModel.findById(id).exec();
    if (!judge) {
      throw new NotFoundException(`Juez con ID "${id}" no encontrado.`);
    }
    return judge;
  }

  async update(id: string, updateJudgeDto: UpdateJudgeDto): Promise<Judge> {
    const updatedJudge = await this.judgeModel
      .findByIdAndUpdate(id, updateJudgeDto, { new: true })
      .exec();
    if (!updatedJudge) {
      throw new NotFoundException(`Juez con ID "${id}" no encontrado para actualizar.`);
    }
    console.log('Juez actualizado');
    return updatedJudge;
  }

  async remove(id: string): Promise<any> {
    const deletedJudge = await this.judgeModel.findByIdAndDelete(id).exec();
    if (!deletedJudge) {
      throw new NotFoundException(`Juez con ID "${id}" no encontrado para eliminar.`);
    }
    return { message: `Juez con ID "${id}" eliminado correctamente.` };
  }
}

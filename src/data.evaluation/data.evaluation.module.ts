// src/data.evaluation/data.evaluation.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataEvaluationService } from './data.evaluation.service';
import { DataEvaluationController } from './data.evaluation.controller';
import { GranularEvaluation, GranularEvaluationSchema } from './schemas/granular-evaluation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GranularEvaluation.name, schema: GranularEvaluationSchema }]),
  ],
  providers: [DataEvaluationService],
  controllers: [DataEvaluationController],
  exports: [DataEvaluationService]
})
export class DataEvaluationModule {}
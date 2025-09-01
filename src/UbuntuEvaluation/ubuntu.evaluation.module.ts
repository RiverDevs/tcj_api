import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UbuntuEvaluationService } from './ubuntu.evaluation.service';
import { UbuntuEvaluationController } from './ubuntu.evaluation.controller';
import { UbuntuEvaluation, UbuntuEvaluationSchema } from './schemas/ubuntu-evaluation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UbuntuEvaluation.name, schema: UbuntuEvaluationSchema }]),
  ],
  providers: [UbuntuEvaluationService],
  controllers: [UbuntuEvaluationController],
  exports: [UbuntuEvaluationService],
})
export class UbuntuEvaluationModule {}
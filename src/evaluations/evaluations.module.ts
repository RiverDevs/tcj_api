// src/evaluations/evaluations.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { Evaluation, EvaluationSchema } from './schemas/evaluation.schema';

// import { AuthModule } from '../auth/auth.module'; // Si necesitas importar tu módulo de autenticación aquí

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Evaluation.name, schema: EvaluationSchema }]),
    // AuthModule, // Importa AuthModule si necesitas sus servicios o estrategias en este módulo
  ],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
  // exports: [EvaluationsService] // Si otros módulos necesitan usar este servicio
})
export class EvaluationsModule {}
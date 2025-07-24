// src/round-results/round-results.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoundResultsService } from './round-results.service';
import { RoundResultsController } from './round-results.controller';
import { RoundResult, RoundResultSchema } from './schemas/round-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RoundResult.name, schema: RoundResultSchema }]),
  ],
  controllers: [RoundResultsController],
  providers: [RoundResultsService],
  exports: [RoundResultsService] // Exporta el servicio si otros módulos lo van a usar
})
export class RoundResultsModule {}
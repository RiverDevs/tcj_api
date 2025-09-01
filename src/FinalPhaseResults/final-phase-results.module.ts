import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinalPhaseResult, FinalPhaseResultSchema } from './schemas/final-phase-result.schema';
import { FinalPhaseResultsService } from './final-phase-results.service';
import { FinalPhaseResultsController } from './final-phase-results.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FinalPhaseResult.name, schema: FinalPhaseResultSchema }]),
  ],
  controllers: [FinalPhaseResultsController],
  providers: [FinalPhaseResultsService],
})
export class FinalPhaseResultsModule {}
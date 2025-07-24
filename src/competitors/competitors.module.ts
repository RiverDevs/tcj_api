// src/competitors/competitors.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompetitorsService } from './competitors.service';
import { CompetitorsController } from './competitors.controller';
import { Competitor, CompetitorSchema } from './schemas/competitor.schema'; // Ruta correcta

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Competitor.name, schema: CompetitorSchema },
    ]),
  ],
  controllers: [CompetitorsController],
  providers: [CompetitorsService],
})
export class CompetitorsModule {}

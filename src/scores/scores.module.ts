// src/scores/scores.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { Score, ScoreSchema } from './schemas/score.schema';
import { Match, MatchSchema } from '../matches/schemas/match.schema';
import { Competitor, CompetitorSchema } from '../competitors/schemas/competitor.schema';
import { Judge, JudgeSchema } from '../judges/schemas/judge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Score.name, schema: ScoreSchema },
      { name: Match.name, schema: MatchSchema },
      { name: Competitor.name, schema: CompetitorSchema },
      { name: Judge.name, schema: JudgeSchema },
    ]),
  ],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}

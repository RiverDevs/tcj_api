// src/matches/matches.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match, MatchSchema } from './schemas/match.schema';
// Update the import path if necessary to match the actual file location
import { Tournament, TournamentSchema } from '../tournaments/schemas/tournament.schema'; // Adjust the import path as necessary
// If the file does not exist, create it at src/tournaments/schemas/tournament.schema.ts and export Tournament and TournamentSchema from it.
import { Competitor, CompetitorSchema } from '../competitors/schemas/competitor.schema';
import { Judge, JudgeSchema } from '../judges/schemas/judge.schema';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Tournament.name, schema: TournamentSchema },
      { name: Competitor.name, schema: CompetitorSchema },
      { name: Judge.name, schema: JudgeSchema },
    ]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}

// src/tournaments/tournaments.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TournamentsService } from './tournaments.service';
import { TournamentsController } from './tournaments.controller';
import { Tournament, TournamentSchema } from './schemas/tournament.schema';
import { Judge, JudgeSchema } from '../judges/schemas/judge.schema'; // Importa Judge y su esquema


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tournament.name, schema: TournamentSchema }, // Para inyectar CategoryModel en TournamentService
      { name: Judge.name, schema: JudgeSchema },       // Para inyectar JudgeModel en TournamentService
    ]),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class TournamentsModule {}

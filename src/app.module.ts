// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importa ConfigService

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { JudgesModule } from './judges/judges.module';
import { CompetitorsModule } from './competitors/competitors.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { ScoresModule } from './scores/scores.module';
import { AuthModule } from './auth/auth.module';
import { validationSchema } from './config/env.validation';
import { EnumsModule } from './enums/enums.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { DataEvaluationModule } from './data.evaluation/data.evaluation.module';
import { RoundResultsModule } from './round-results/round-results.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que ConfigService esté disponible en toda la aplicación
      validationSchema: validationSchema, // Tu esquema de validación para las variables de entorno
      validationOptions: {
        abortEarly: false, // Reporta todos los errores de validación, no solo el primero
      },
    }),
    // Modificación para usar MongooseModule.forRootAsync
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule para poder inyectar ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Obtiene MONGO_URI de ConfigService
      }),
      inject: [ConfigService], // Inyecta ConfigService en useFactory
    }),
    CategoriesModule,
    JudgesModule,
    CompetitorsModule,
    TournamentsModule,
    MatchesModule,
    ScoresModule,
    AuthModule,
    EnumsModule,
    EvaluationsModule,
    DataEvaluationModule,
    RoundResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// src/judges/judges.module.ts
// src/judges/judges.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JudgesService } from './judges.service';
import { JudgesController } from './judges.controller';
import { Judge, JudgeSchema } from './schemas/judge.schema'; // Asegúrate de que esta ruta sea correcta

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Judge.name, schema: JudgeSchema }]),
  ],
  controllers: [JudgesController],
  providers: [JudgesService],
})
export class JudgesModule {}

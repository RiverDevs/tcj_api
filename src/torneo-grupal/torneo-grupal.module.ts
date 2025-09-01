// src/torneo-grupal/torneo-grupal.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PenaltiesController } from './controllers/penalties.controller';
import { PenaltiesService } from './services/penalties.service';
import { Penalty, PenaltySchema } from './schemas/penalty.schema';
import { ClassificationsController } from './controllers/classifications.controller'; // Importa el nuevo controlador
import { ClassificationsService } from './services/classifications.service'; // Importa el nuevo servicio
import { Classification, ClassificationSchema } from './schemas/classification.schema'; // Importa el nuevo esquema

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Penalty.name, schema: PenaltySchema }]),
        MongooseModule.forFeature([{ name: Classification.name, schema: ClassificationSchema }]), // Añade el nuevo esquema
    ],
    controllers: [PenaltiesController, ClassificationsController], // Añade el nuevo controlador
    providers: [PenaltiesService, ClassificationsService], // Añade el nuevo servicio
})
export class TorneoGrupalModule {}
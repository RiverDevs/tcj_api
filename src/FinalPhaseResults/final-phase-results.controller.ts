import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FinalPhaseResultsService } from './final-phase-results.service';
import { CreateFinalPhaseResultDto } from './dto/create-final-phase-result.dto';
import { AuthGuard } from '@nestjs/passport'; // O tu guardia de autenticación

@Controller('final-phase-results')
export class FinalPhaseResultsController {
  constructor(private readonly finalPhaseResultsService: FinalPhaseResultsService) {}

  @UseGuards(AuthGuard('jwt')) // O tu guardia de autenticación personalizado
  @Post()
  async createOrUpdate(@Body() createFinalPhaseResultDto: CreateFinalPhaseResultDto) {
    const result = await this.finalPhaseResultsService.createOrUpdate(createFinalPhaseResultDto);
    return {
      message: 'Resultados de fase final guardados exitosamente',
      data: result,
    };
  }
}
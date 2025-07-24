// src/round-results/round-results.controller.ts
import { Controller, Post, Body, UseGuards, Get, Query, ConflictException, HttpStatus, HttpCode } from '@nestjs/common';
import { RoundResultsService } from './round-results.service';
import { CreateRoundResultDto } from './dto/create-round-result.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // Asegúrate de que la ruta sea correcta

@UseGuards(JwtAuthGuard) // Protege este controlador también
@Controller('round-results') // Endpoint: /api/round-results
export class RoundResultsController {
  constructor(private readonly roundResultsService: RoundResultsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Devuelve 201 Created por defecto
  async create(@Body() createRoundResultDto: CreateRoundResultDto) {
    // Opcional: Lógica para evitar duplicados, si un resultado para la misma ronda/config ya existe
    const existingResult = await this.roundResultsService.findOneByConfig(
      createRoundResultDto.tournamentId,
      createRoundResultDto.group,
      createRoundResultDto.category,
      createRoundResultDto.roundNumber,
      createRoundResultDto.subCategory
    );

    if (existingResult) {
      // Si ya existe, puedes elegir actualizarlo o lanzar un error de conflicto
      // Aquí elegimos actualizar si ya existe un registro para esta ronda/config
      return this.roundResultsService.update(String(existingResult._id), createRoundResultDto);
      // O si prefieres lanzar un error y que el usuario sepa que ya existe:
      // throw new ConflictException('Ya existe un resultado guardado para esta configuración de ronda.');
    }
    
    return this.roundResultsService.create(createRoundResultDto);
  }

  // Puedes añadir un GET si quieres recuperar los resultados finales guardados por la configuración
  @Get()
  async getRoundResults(
    @Query('tournamentId') tournamentId: string,
    @Query('group') group: string,
    @Query('category') category: string,
    @Query('roundNumber') roundNumber: string,
    @Query('subCategory') subCategory?: string,
  ) {
    if (!tournamentId || !group || !category || !roundNumber) {
      throw new ConflictException('tournamentId, group, category y roundNumber son requeridos para buscar resultados.');
    }
    return this.roundResultsService.findOneByConfig(
      tournamentId,
      group,
      category,
      parseInt(roundNumber, 10),
      subCategory
    );
  }
}
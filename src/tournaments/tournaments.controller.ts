// src/tournaments/tournaments.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/schemas/user.schema';


@Controller('tournaments')
@UseGuards(JwtAuthGuard) // <--- El controlador completo sigue requiriendo autenticación JWT
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createTournamentDto: CreateTournamentDto) {
     return this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  @Roles(UserRole.JUDGE, UserRole.ADMIN)
  async findAll() {
    return this.tournamentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.JUDGE, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateTournamentDto: UpdateTournamentDto) {
   return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) 
  remove(@Param('id') id: string) {
   return this.tournamentsService.remove(id);
  }
}



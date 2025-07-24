// src/competitors/competitors.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { CompetitorsService } from './competitors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoryEnum } from './enums/category.enum';

@Controller('competitors')
export class CompetitorsController {
  constructor(private readonly competitorsService: CompetitorsService) {}


  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@Request() req) {
    return this.competitorsService.findMyProfile(req.user.id);
  }

  @Get('categories')
  getCategories() {
    return Object.values(CategoryEnum);
  }
}

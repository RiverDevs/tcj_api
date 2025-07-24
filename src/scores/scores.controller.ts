import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/schemas/user.schema';
import { AssignScoreDto } from './dto/assign-score.dto'; // <-- Debes crear este DTO
import { ScoresService } from './scores.service';

@Controller('scores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScoresController {

  constructor(private readonly scoresService: ScoresService) {}

  @Post()
  @Roles(UserRole.JUDGE)
  assignScore(@Body() assignScoreDto: AssignScoreDto, @Req() req) {
    const judgeId = req.user.id;
    return this.scoresService.assign(assignScoreDto, judgeId);
  }
}

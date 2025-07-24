import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JudgesService } from './judges.service';
import { CreateJudgeDto } from './dto/create-judge.dto';
import { UpdateJudgeDto } from './dto/update-judge.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/schemas/user.schema';

@Controller('judges')
export class JudgesController {
  constructor(private readonly judgesService: JudgesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createJudgeDto: CreateJudgeDto) {
    return this.judgesService.create(createJudgeDto);
  }

  @Get()
  findAll() {
    return this.judgesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.judgesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJudgeDto: UpdateJudgeDto) {
    return this.judgesService.update(id, updateJudgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.judgesService.remove(id);
  }
}

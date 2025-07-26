// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from './schemas/user.schema';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
 // @UseGuards(JwtAuthGuard, RolesGuard)
 // @Roles(UserRole.ADMIN)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('judges') // La ruta será /auth/judges (o /users/judges si cambias el Controller)
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Protege la ruta con JWT y RolesGuard
  @Roles(UserRole.ADMIN) // Solo el rol de ADMIN puede acceder a esta lista
  async getJudges() {
    const judges = await this.authService.findAllJudges();
    return { message: 'Jueces obtenidos exitosamente', judges };
  }
}


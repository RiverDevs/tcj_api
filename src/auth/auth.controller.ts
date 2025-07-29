import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Patch, Request, Param, Delete, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from './schemas/user.schema';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Importar el nuevo DTO

@Controller('auth') // Mantendremos 'auth' por ahora, pero considera 'users' si el CRUD de usuarios es extenso.
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // Se utiliza para registrar nuevos usuarios con roles específicos (ADMIN lo hace)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // --- NUEVAS RUTAS PARA EL CRUD DE USUARIOS (FRONTEND) ---

  @Get('users') // Obtener todos los usuarios
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllUsers() {
    return this.authService.findAllUsers();
  }

  @Get('users/:id') // Obtener un usuario por ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOneUser(@Param('id') id: string) {
    return this.authService.findOneUser(id);
  }

  @Put('users/:id') // Actualizar un usuario por ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id') // Eliminar un usuario por ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  // --- RUTAS EXISTENTES ---

  @Get('judges')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async getJudges() {
    const judges = await this.authService.findAllJudges();
    return { message: 'Jueces obtenidos exitosamente', judges };
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, changePasswordDto.currentPassword, changePasswordDto.newPassword);
  }
}


import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Importar Types
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Judge, JudgeDocument } from '../judges/schemas/judge.schema';
import { Competitor, CompetitorDocument } from '../competitors/schemas/competitor.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Judge.name) private readonly judgeModel: Model<JudgeDocument>,
    @InjectModel(Competitor.name) private readonly competitorModel: Model<CompetitorDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ accessToken?: string; user: any }> {
    const { username, password, role, firstName, lastName, email, category } = createUserDto;

    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) throw new ConflictException('El usuario ya existe');

    // Refactorización para manejar entityRef de forma más limpia
    const newUserObj: any = {
        username,
        password,
        role,
        firstName,
        lastName,
        email,
    };

    if (role === UserRole.JUDGE) {
        // Verificar si ya existe un juez con el mismo email, por ejemplo
        const existingJudge = await this.judgeModel.findOne({ email });
        if (existingJudge) throw new ConflictException('Ya existe un juez con este email.');
        const createdJudge = await this.judgeModel.create({ firstName, lastName, email });
        newUserObj.judgeRef = createdJudge._id;
    } else if (role === UserRole.COMPETITOR) {
        // Verificar si ya existe un competidor con el mismo email/nombre, etc.
        const existingCompetitor = await this.competitorModel.findOne({ email });
        if (existingCompetitor) throw new ConflictException('Ya existe un competidor con este email.');
        const createdCompetitor = await this.competitorModel.create({ firstName, lastName, email, category });
        newUserObj.competitorRef = createdCompetitor._id;
        newUserObj.category = category; // Asegúrate de asignar la categoría también al usuario
    }

    const newUser = await this.userModel.create(newUserObj);

    return {
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        category: newUser.category,
        judgeRef: newUser.judgeRef,
        competitorRef: newUser.competitorRef,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: any }> {
    const username = loginDto.username.toLowerCase().trim();
    const user = await this.userModel.findOne({ username }).exec();

    if (!user || !(await user.comparePassword(loginDto.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user._id,
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }
  }

  async findAllJudges(): Promise<User[]> {
    return this.userModel.find({ role: UserRole.JUDGE })
      .select('username firstName lastName email')
      .exec();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOneUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUser = await this.userModel.findOne({ username: updateUserDto.username });
        // Asegurarse de que el ID del usuario existente no sea el mismo que el que estamos actualizando
        if (existingUser && (existingUser._id as Types.ObjectId).toString() !== id) { // <-- Corrección aquí
            throw new ConflictException('El nuevo nombre de usuario ya está en uso.');
        }
    }

    if (updateUserDto.password) {
      user.password = updateUserDto.password;
    }

    // Actualizar campos del usuario
    // Object.assign(user, updateUserDto) podría sobrescribir campos a `undefined` si no están en DTO.
    // Es mejor actualizar solo los campos presentes en updateUserDto
    for (const key in updateUserDto) {
        if (updateUserDto.hasOwnProperty(key) && updateUserDto[key] !== undefined) {
            // @ts-ignore: Acceso dinámico de propiedades
            user[key] = updateUserDto[key];
        }
    }

    // Actualizar la entidad relacionada (Judge/Competitor) si el rol lo requiere
    if (user.role === UserRole.JUDGE && user.judgeRef) {
      await this.judgeModel.findByIdAndUpdate(user.judgeRef, {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        email: updateUserDto.email,
      }).exec();
    } else if (user.role === UserRole.COMPETITOR && user.competitorRef) {
      await this.competitorModel.findByIdAndUpdate(user.competitorRef, {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        email: updateUserDto.email,
        category: updateUserDto.category,
      }).exec();
    }

    await user.save();
    return user.toObject({ getters: true, virtuals: false });
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    if (user.role === UserRole.JUDGE && user.judgeRef) {
      await this.judgeModel.findByIdAndDelete(user.judgeRef).exec();
    } else if (user.role === UserRole.COMPETITOR && user.competitorRef) {
      await this.competitorModel.findByIdAndDelete(user.competitorRef).exec();
    }

    await this.userModel.findByIdAndDelete(id).exec();
    return { message: `Usuario con ID "${id}" y sus datos asociados eliminados exitosamente.` };
  }

  async changePassword(userId: string, currentPassword, newPassword): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Contraseña actualizada exitosamente.' };
  }
}
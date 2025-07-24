// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto'; // Asegúrate de que este DTO esté creado
import { LoginDto } from './dto/login.dto'; // Asegúrate de que este DTO esté creado
import { Judge, JudgeDocument } from '../judges/schemas/judge.schema';
import { Competitor, CompetitorDocument } from '../competitors/schemas/competitor.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Judge.name) private readonly judgeModel: Model<JudgeDocument>,
    @InjectModel(Competitor.name) private readonly competitorModel: Model<CompetitorDocument>,
    private jwtService: JwtService,
  ) {}

  // auth/auth.service.ts
async register(createUserDto: CreateUserDto): Promise<{ accessToken: string; user: any }> {
  const { username, password, role, firstName, lastName, email, category } = createUserDto;

  // Validar usuario existente
  const existingUser = await this.userModel.findOne({ username });
  if (existingUser) throw new ConflictException('El usuario ya existe');

  // Crear entidad relacionada (Judge/Competitor) según el rol
  let entityRef;
  if (role === UserRole.JUDGE) {
    entityRef = await this.judgeModel.create({ firstName, lastName, email});
  } else if (role === UserRole.COMPETITOR) {
    entityRef = await this.competitorModel.create({ firstName, lastName, email, category });
  }

  // Crear el usuario y vincularlo
  const newUser = await this.userModel.create({
    username,
    password,
    role,
    firstName,
    lastName,
    email,
    category,
    judgeRef: role === UserRole.JUDGE ? entityRef._id : undefined,
    competitorRef: role === UserRole.COMPETITOR ? entityRef._id : undefined,
  });

  // Generar JWT
  const payload = { sub: newUser._id, role: newUser.role };
  const accessToken = this.jwtService.sign(payload);

  // Return only plain user data to avoid leaking Mongoose document types
  return {
    accessToken,
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
    // Usamos lowercase en el username por si lo definimos así en el schema
    const username = loginDto.username.toLowerCase().trim();
    const user = await this.userModel.findOne({ username }).exec();

    // Ahora `user.comparePassword` usa bcrypt y funcionará correctamente
    if (!user || !(await user.comparePassword(loginDto.password))) {
    throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
    sub: user._id, 
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload);
    
    // Devolvemos un objeto limpio con los datos del usuario  
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
                         .select('username firstName lastName') // Selecciona solo los campos necesarios
                         .exec();
  }
}
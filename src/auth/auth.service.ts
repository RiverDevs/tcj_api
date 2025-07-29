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
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Importar el nuevo DTO
import { Judge, JudgeDocument } from '../judges/schemas/judge.schema'; // Asegúrate de que esta ruta sea correcta
import { Competitor, CompetitorDocument } from '../competitors/schemas/competitor.schema'; // Asegúrate de que esta ruta sea correcta
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Judge.name) private readonly judgeModel: Model<JudgeDocument>,
    @InjectModel(Competitor.name) private readonly competitorModel: Model<CompetitorDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ accessToken?: string; user: any }> { // accessToken es opcional en el retorno
    const { username, password, role, firstName, lastName, email, category } = createUserDto;

    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) throw new ConflictException('El usuario ya existe');

    let entityRef = null;
    if (role === UserRole.JUDGE) {
      // Verificar si ya existe un juez con el mismo email, por ejemplo
      const existingJudge = await this.judgeModel.findOne({ email });
      if (existingJudge) throw new ConflictException('Ya existe un juez con este email.');
      entityRef = await this.judgeModel.create({ firstName, lastName, email });
    } else if (role === UserRole.COMPETITOR) {
      // Verificar si ya existe un competidor con el mismo email/nombre, etc.
      const existingCompetitor = await this.competitorModel.findOne({ email });
      if (existingCompetitor) throw new ConflictException('Ya existe un competidor con este email.');
      entityRef = await this.competitorModel.create({ firstName, lastName, email, category });
    }

    // El middleware 'pre save' en user.schema.ts se encargará de hashear la contraseña
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

    // Si el registro es desde el panel de admin, no siempre necesitamos devolver un token
    // solo si se registra a uno mismo. Para un CRUD, no se devuelve.
    // Aquí puedes decidir si quieres que el registro de un nuevo usuario por un ADMIN
    // devuelva un token. Por simplicidad para el CRUD, no lo haremos.
    // const payload = { sub: newUser._id, role: newUser.role };
    // const accessToken = this.jwtService.sign(payload);

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
        lastName: user.lastName,
        email: user.email,
        category: user.category
      }
    };
  }

  async findAllJudges(): Promise<User[]> {
    return this.userModel.find({ role: UserRole.JUDGE })
      .select('username firstName lastName email') // Incluye email
      .exec();
  }

  // --- NUEVOS MÉTODOS PARA EL CRUD DE USUARIOS ---

  async findAllUsers(): Promise<User[]> {
    // Excluir la contraseña al obtener todos los usuarios
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

    // Si se intenta cambiar el username a uno ya existente por otro usuario
    if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUser = await this.userModel.findOne({ username: updateUserDto.username });
        if (existingUser && existingUser._id.toString() !== id) {
            throw new ConflictException('El nuevo nombre de usuario ya está en uso.');
        }
    }

    // Si se proporciona una nueva contraseña, hashearla. El pre-hook 'save' de Mongoose se encargará de esto si asignamos a `user.password`.
    if (updateUserDto.password) {
      user.password = updateUserDto.password; // El pre-hook lo hasheará
    }

    // Actualizar campos del usuario
    Object.assign(user, updateUserDto);

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

    await user.save(); // Guarda el usuario (y activa el pre-hook para la contraseña)
    return user.toObject({ getters: true, virtuals: false }); // Devuelve el objeto limpio sin la contraseña
  }


  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    // Eliminar la entidad relacionada si existe
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

    // El pre-hook de Mongoose se encargará de hashear la nueva contraseña
    user.password = newPassword;
    await user.save();

    return { message: 'Contraseña actualizada exitosamente.' };
  }
}
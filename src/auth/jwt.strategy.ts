// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    // Obtener el JWT_SECRET y asegurarse de que sea un string.
    // Aunque Joi valida, TypeScript no siempre lo "sabe" en este contexto del super().
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // **AÑADE ESTA VALIDACIÓN AQUÍ**
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está definido. Asegúrate de configurarlo en tu .env.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // TypeScript ahora sabe que jwtSecret es string gracias al 'if'
    });
  }

  async validate(payload: any): Promise<UserDocument> {
    const user = await this.userModel.findById(payload.sub).exec();
    if (!user) {
      throw new UnauthorizedException('Usuario no autorizado o token inválido.');
    }
    return user;
  }
}
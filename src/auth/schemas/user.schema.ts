
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  JUDGE = 'judge',
  COMPETITOR = 'competitor',
}

// Interfaz para métodos personalizados
export interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export interface UserDocument extends Document, UserMethods {
  // ... tus propiedades ...
  username: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  judgeRef?: Types.ObjectId;
  competitorRef?: Types.ObjectId;
}

@Schema({ timestamps: true }) // timestamps es una buena práctica
export class User {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, type: String })
  role: UserRole;

  @Prop({ required: true  })
  firstName?: string;

  @Prop({ required: true })
  lastName?: string;

  @Prop({ required: true })
  email?: string;

  @Prop({ required: true })
  category?: string;

  @Prop({ type: Types.ObjectId, ref: 'Judge' })
  judgeRef?: Types.ObjectId;
 
  @Prop({ type: Types.ObjectId, ref: 'Competitor' }) 
  competitorRef?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Middleware (hook) que se ejecuta ANTES de guardar el documento
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
     return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Implementación REAL del método para comparar contraseñas
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
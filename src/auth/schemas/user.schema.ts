import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CategoryEnum } from 'src/competitors/enums/category.enum'; // Asegúrate de esta importación

export enum UserRole {
  ADMIN = 'admin',
  JUDGE = 'judge',
  COMPETITOR = 'competitor',
}

export interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export interface UserDocument extends Document, UserMethods {
  username: string;
  password: string;
  role: UserRole;
  firstName?: string; // Hacemos opcional
  lastName?: string;  // Hacemos opcional
  email?: string;     // Hacemos opcional
  category?: CategoryEnum; // Hacemos opcional y usamos el enum
  judgeRef?: Types.ObjectId;
  competitorRef?: Types.ObjectId;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  username: string;

  @Prop({ required: true, select: false }) // No incluir la contraseña por defecto en las consultas
  password: string;

  @Prop({ required: true, enum: UserRole, type: String, default: UserRole.COMPETITOR }) // Añadido default
  role: UserRole;

  @Prop({ required: false }) // Hacemos false
  firstName?: string;

  @Prop({ required: false }) // Hacemos false
  lastName?: string;

  @Prop({ required: false, unique: true, sparse: true }) // Hacemos false, unique y sparse para permitir nulos
  email?: string;

  @Prop({ required: false, enum: CategoryEnum, type: String }) // Hacemos false y usamos el enum
  category?: CategoryEnum;

  @Prop({ type: Types.ObjectId, ref: 'Judge' })
  judgeRef?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Competitor' })
  competitorRef?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
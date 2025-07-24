// src/judges/dto/create-judge.dto.ts
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateJudgeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  certificationId?: string;
}
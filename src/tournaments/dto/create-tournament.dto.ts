// src/tournaments/dto/create-tournament.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsDateString, // Para validar fechas en formato string (ISO 8601)
  IsOptional,
  IsBoolean,
  IsArray,
  IsMongoId, // Para validar IDs de MongoDB
  IsNumber,
  Min,
} from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date; // Se espera string en formato ISO para la entrada

  @IsDateString()
  @IsNotEmpty()
  endDate: Date; // Se espera string en formato ISO para la entrada

  @IsString()
  @IsOptional()
  status?: string; // 'scheduled', 'active', 'completed', 'cancelled'

  @IsArray()
  @IsMongoId({ each: true }) // Valida que cada elemento del array sea un ID de MongoDB válido
  @IsOptional() // Puede que no se asignen categorías al crear el torneo inicialmente
  categories?: string[]; // IDs de categorías como strings

  @IsArray()
  @IsMongoId({ each: true }) // Valida que cada elemento del array sea un ID de MongoDB válido
  @IsOptional() // Puede que no se asignen jueces al crear el torneo inicialmente
  judges?: string[]; // IDs de jueces como strings

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxCompetitors?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  registeredCompetitors?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateFinalPhaseResultDto {
  @IsNotEmpty()
  @IsString()
  readonly tournament: string;

  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @IsNotEmpty()
  @IsString()
  readonly subCategory: string;

  @IsNotEmpty()
  @IsString()
  readonly round: string;

  @IsNotEmpty()
  @IsString()
  readonly team: string;

  @IsNotEmpty()
  @IsNumber()
  readonly score: number;
}
import { IsEnum, IsArray, ArrayMinSize, ArrayMaxSize, IsMongoId, IsOptional, IsDateString, IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { CategoryEnum } from '../../categories/enums/category.enum';

export class CreateMatchDto {
  @IsMongoId()
  @IsNotEmpty()
  tournament: string;

  @IsEnum(CategoryEnum)
  @IsNotEmpty()
  category: CategoryEnum;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsMongoId({ each: true })
  competitors: string[];

  @IsArray()
  @IsMongoId({ each: true })
  judges: string[];

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  startTime?: Date;

  @IsDateString()
  @IsOptional()
  endTime?: Date;

  @IsString()
  @IsOptional()
  round?: string;

  @IsNumber()
  @IsOptional()
  matchNumber?: number;

  @IsMongoId()
  @IsOptional()
  winner?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

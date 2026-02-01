import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEmail,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { RecruitmentStatus } from '../entities/recruitment.entity';

export class CreateRecruitmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(160)
  position?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  salary_expectation?: string;

  @IsString()
  @IsOptional()
  cover_letter?: string;

  @IsEnum(RecruitmentStatus)
  @IsOptional()
  status?: RecruitmentStatus;

  @IsInt()
  @IsOptional()
  position_id?: number;
}

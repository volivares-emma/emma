import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { MaterialType } from '../entities/course-material.entity';

export class CreateCourseMaterialDto {
  @IsInt()
  @IsNotEmpty()
  course_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  file_path?: string;

  @IsString()
  @IsOptional()
  file_url?: string;

  @IsEnum(MaterialType)
  @IsNotEmpty()
  material_type: MaterialType;

  @IsInt()
  @IsOptional()
  file_size?: number;

  @IsInt()
  @IsOptional()
  sort_order?: number;

  @IsBoolean()
  @IsOptional()
  is_required?: boolean;
}

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  MaxLength,
} from 'class-validator';
import { SlideVisualType } from '../entities/slide.entity';

export class CreateSlideDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(220)
  subtitle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  button_text?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  button_link?: string;

  @IsEnum(SlideVisualType)
  @IsOptional()
  visual_type?: SlideVisualType;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsInt()
  @IsOptional()
  sort_order?: number;
}

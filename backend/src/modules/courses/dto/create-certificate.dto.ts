import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCertificateDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  course_id: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  certificate_code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  file_url?: string;
}

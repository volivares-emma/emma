import { IsInt, IsOptional, Min, Max, IsString } from 'class-validator';

export class UpdateCourseProgressDto {
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  progress_percentage?: number;

  @IsString()
  @IsOptional()
  current_module?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  time_spent_minutes?: number;

  @IsString()
  @IsOptional()
  completion_notes?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

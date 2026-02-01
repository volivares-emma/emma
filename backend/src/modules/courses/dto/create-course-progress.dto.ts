import { IsInt, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCourseProgressDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsInt()
  @IsNotEmpty()
  course_id: number;

  @IsInt()
  @IsNotEmpty()
  material_id: number;

  @IsBoolean()
  @IsOptional()
  is_completed?: boolean;

  @IsInt()
  @IsOptional()
  time_spent_seconds?: number;
}

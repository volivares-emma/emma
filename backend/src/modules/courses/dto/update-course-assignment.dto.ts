import {
  IsInt,
  IsOptional,
  IsEnum,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { AssignmentStatus } from '../entities/assignment-status.enum';

export class UpdateCourseAssignmentDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsInt()
  @IsOptional()
  course_id?: number;

  @IsInt()
  @IsOptional()
  user_id?: number;

  @IsEnum(AssignmentStatus)
  @IsOptional()
  status?: AssignmentStatus;

  @IsDateString()
  @IsOptional()
  due_date?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

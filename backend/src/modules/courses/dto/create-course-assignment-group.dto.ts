import {
  IsArray,
  ArrayNotEmpty,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AssignmentStatus } from '../entities/assignment-status.enum';

export class CreateCourseAssignmentGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsInt()
  @IsNotEmpty()
  course_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  user_ids: number[];

  @IsDateString()
  @IsOptional()
  due_date?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(AssignmentStatus)
  @IsOptional()
  status?: AssignmentStatus;
}

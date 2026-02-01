import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsDateString,
  ValidateIf,
  IsString,
  MaxLength,
} from 'class-validator';
import { AssignmentStatus } from '../entities/assignment-status.enum';

export class CreateCourseAssignmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsInt()
  @IsNotEmpty()
  @ValidateIf(
    (o: CreateCourseAssignmentDto) => !o.user_ids || o.user_ids.length === 0,
  )
  user_id?: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ValidateIf((o: CreateCourseAssignmentDto) => !o.user_id)
  user_ids?: number[];

  @IsInt()
  @IsNotEmpty()
  course_id: number;

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

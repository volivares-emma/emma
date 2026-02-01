import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AssignmentStatus } from '../entities/assignment-status.enum';

export class UpdateCourseAssignmentGroupDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

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

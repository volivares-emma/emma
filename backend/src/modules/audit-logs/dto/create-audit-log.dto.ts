import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  MaxLength,
  IsObject,
} from 'class-validator';

export class CreateAuditLogDto {
  @IsInt()
  @IsOptional()
  user_id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  action: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  entity_type: string;

  @IsInt()
  @IsOptional()
  entity_id?: number;

  @IsObject()
  @IsOptional()
  old_values?: any;

  @IsObject()
  @IsOptional()
  new_values?: any;

  @IsString()
  @IsOptional()
  @MaxLength(45)
  ip_address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  user_agent?: string;
}

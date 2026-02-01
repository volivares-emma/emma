import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ContactStatus } from '../entities/contact.entity';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(160)
  company?: string;

  @IsString()
  @IsOptional()
  @MaxLength(160)
  subject?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(ContactStatus)
  @IsOptional()
  status?: ContactStatus;
}

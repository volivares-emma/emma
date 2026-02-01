import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  MaxLength,
} from 'class-validator';
import {
  SubscriptionStatus,
  SubscriptionType,
} from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(160)
  name?: string;

  @IsEnum(SubscriptionType)
  @IsOptional()
  type?: SubscriptionType;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @IsString()
  @IsOptional()
  @MaxLength(160)
  source?: string;
}

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import {
  NotificationType,
  NotificationShowOnPages,
} from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  notification_type: NotificationType;

  @IsEnum(NotificationShowOnPages)
  @IsNotEmpty()
  show_on_pages: NotificationShowOnPages;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  action_url?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  action_text?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  dismissible?: boolean;
}

import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  related_type: string;

  @IsInt()
  related_id: number;
}

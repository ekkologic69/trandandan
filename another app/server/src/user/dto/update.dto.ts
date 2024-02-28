import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUsernameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  username: string;
}

export class UpdateEmailDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  @IsNotEmpty()
  email: string;
}

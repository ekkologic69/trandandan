import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DmEntity {
  constructor(partial: Partial<DmEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userAId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userBId: string;

  @ApiProperty()
  avatar: string;
}

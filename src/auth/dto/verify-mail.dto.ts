import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyMailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'token gotten from the user mail' })
  token: string;
}

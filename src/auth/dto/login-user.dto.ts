import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'charlesayom@gmail.com', description: 'User email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Password@123', description: 'User password' })
  password: string;
}

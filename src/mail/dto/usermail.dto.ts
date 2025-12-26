import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserMailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'first name is compulsory and must be a string' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'last name is compulsory and must be a string' })
  lastName: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'email is compulsory and must be a string' })
  email: string;
}

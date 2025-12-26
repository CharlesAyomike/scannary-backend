import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'user country' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
    {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    },
  )
  @ApiProperty({
    description:
      'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'phone number is compulsory and must be a string',
  })
  phoneNumber: string;
}

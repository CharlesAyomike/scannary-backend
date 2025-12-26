import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nigeria' })
  countryName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NG' })
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NGN' })
  currency: string;
}

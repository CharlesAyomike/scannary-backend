import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class FeaturesDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ example: 2 })
  planId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'outlet' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ example: 5 })
  maxAmount: number;
}

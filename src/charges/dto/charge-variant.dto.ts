import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChargesVariantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Monthly' })
  duration: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  subscriptionChargesId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { INTERVAL } from 'src/entities/subChargesVarient.entity';

export class ChargesVariantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'month' })
  interval: INTERVAL;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  intervalCount: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '1' })
  subscriptionChargesId: number;
}

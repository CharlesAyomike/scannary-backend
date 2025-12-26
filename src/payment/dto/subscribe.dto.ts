import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class SubscribeDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'this is the charges id' })
  subscriptionChargesId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty({ example: 4, description: 'this is the charges variant id' })
  subChargesVariantId: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'to renew subcription automatically',
  })
  autoRenew: boolean;
}

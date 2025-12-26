import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PriceCurrencyPairDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 2,
    description: 'variant id for which you are setting a price currency pair',
  })
  variantId: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NGN', description: 'currency of subscription' })
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 15000, description: 'amount of subscription' })
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 35426,
    description: 'subscription id from flutterwave',
  })
  flutterwaveId: number;
}

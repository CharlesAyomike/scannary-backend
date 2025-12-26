import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChargeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Basic', description: 'Subscription name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'This is a basic subscription',
    description: 'Subscription description',
  })
  description: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOutletDto {
  @IsString()
  @ApiProperty({
    example: 'Chicken Republic Gbagada',
    description: 'this is the name of the outlet eg a resturant, hotel etc',
  })
  name: string;
}

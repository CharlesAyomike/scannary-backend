import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Roles } from 'src/entities/users.entity';

export class RolesDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: 'User',
    description: 'access roles of the user or admin',
  })
  roles: Roles[];
}

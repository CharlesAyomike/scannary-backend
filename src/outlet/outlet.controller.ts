import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { OutletService } from './outlet.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { UserType } from 'src/auth/decorator/user-type.decorator';
import { AccountType } from 'src/entities/users.entity';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Roles as AllowedRole } from 'src/entities/users.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('jwt-auth')
@UserType(AccountType.USER)
@Roles(AllowedRole.User)
@Controller('outlet')
export class OutletController {
  constructor(private readonly outletService: OutletService) {}

  @Post()
  create(@Req() req, @Body() createOutletDto: CreateOutletDto) {
    return this.outletService.create(createOutletDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.outletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outletService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutletDto: UpdateOutletDto) {
    return this.outletService.update(+id, updateOutletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outletService.remove(+id);
  }
}

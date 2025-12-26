import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserType } from 'src/auth/decorator/user-type.decorator';
import { AccountType } from 'src/entities/users.entity';
import { RolesDto } from './dto/roles.dto';

@ApiBearerAuth('jwt-auth')
@UserType(AccountType.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('get-all-admin')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'keyword can be admin firstname, lastname or email',
  })
  findAllAdmin(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
  ) {
    // Ensure the inputs are treated as numbers
    return this.adminService.findAllAdmin(+page, +limit, keyword);
  }

  @Get('get-all-users')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'keyword can be user firstname, lastname or email',
  })
  findAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
  ) {
    // Ensure the inputs are treated as numbers
    return this.adminService.findAllUsers(+page, +limit, keyword);
  }

  @Get('get-user/:id')
  findOneUser(@Param('id') id: number) {
    return this.adminService.findById(id);
  }

  @Patch('block-user/:action/:id')
  block(@Param('action') action: 'block' | 'unblock', @Param('id') id: number) {
    return this.adminService.block(action, id);
  }

  @Patch('convert/:action/:id')
  convert(
    @Param('action') action: 'toAdmin' | 'toUser',
    @Param('id') id: number,
    @Body() rolesDto: RolesDto,
  ) {
    return this.adminService.convert(action, id, rolesDto);
  }
}

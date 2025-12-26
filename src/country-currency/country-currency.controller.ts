import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CountryCurrencyService } from './country-currency.service';
import { CreateCountryCurrencyDto } from './dto/create-country-currency.dto';
import { UpdateCountryCurrencyDto } from './dto/update-country-currency.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserType } from 'src/auth/decorator/user-type.decorator';
import { Roles } from 'src/auth/decorator/role.decorator';
import { AccountType } from 'src/entities/users.entity';
import { Roles as AllowedRoles } from 'src/entities/users.entity';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('country-currency')
export class CountryCurrencyController {
  constructor(
    private readonly countryCurrencyService: CountryCurrencyService,
  ) {}

  @ApiBearerAuth('jwt-auth')
  @UserType(AccountType.ADMIN)
  @Roles(AllowedRoles.Operator, AllowedRoles.SuperAdmin)
  @Post()
  create(@Body() createCountryCurrencyDto: CreateCountryCurrencyDto) {
    return this.countryCurrencyService.create(createCountryCurrencyDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.countryCurrencyService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countryCurrencyService.findOne(+id);
  }

  @ApiBearerAuth('jwt-auth')
  @UserType(AccountType.ADMIN)
  @Roles(AllowedRoles.Operator, AllowedRoles.SuperAdmin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCountryCurrencyDto: UpdateCountryCurrencyDto,
  ) {
    return this.countryCurrencyService.update(+id, updateCountryCurrencyDto);
  }

  @ApiBearerAuth('jwt-auth')
  @UserType(AccountType.ADMIN)
  @Roles(AllowedRoles.Operator, AllowedRoles.SuperAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countryCurrencyService.remove(+id);
  }
}

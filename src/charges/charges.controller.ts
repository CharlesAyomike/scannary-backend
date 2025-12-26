import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ChargesService } from './charges.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { ChargesVariantDto } from './dto/charge-variant.dto';
import { UpdateChargeVariantDto } from './dto/update-charge-variant.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserType } from 'src/auth/decorator/user-type.decorator';
import { AccountType } from 'src/entities/users.entity';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Roles as AllowedRoles } from 'src/entities/users.entity';
import { Public } from 'src/auth/decorator/public.decorator';
import { PriceCurrencyPairDto } from './dto/price-currency.dto';
import { UpdatePriceCurrencyPairDto } from './dto/update-price-currency.dto';

@Controller('charges')
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @ApiBearerAuth('jwt-auth')
  @UserType(AccountType.ADMIN)
  @Roles(AllowedRoles.Operator, AllowedRoles.SuperAdmin)
  @Post('create-charge')
  createCharge(@Body() chargesDto: CreateChargeDto) {
    return this.chargesService.createCharge(chargesDto);
  }

  @ApiBearerAuth('jwt-auth')
  @UserType(AccountType.ADMIN)
  @Roles(AllowedRoles.Operator, AllowedRoles.SuperAdmin)
  @Post('create-charge-variant')
  createChargeVariant(@Body() chargesVariantDto: ChargesVariantDto) {
    return this.chargesService.createChargeVariant(chargesVariantDto);
  }

  @ApiBearerAuth('jwt-auth')
  @UserType(AccountType.ADMIN)
  @Roles(AllowedRoles.Operator, AllowedRoles.SuperAdmin)
  @Post('create-price-currency-pair')
  createPriceCurrencyPair(@Body() priceCurrencyPair: PriceCurrencyPairDto) {
    return this.chargesService.createPriceCurrencyPair(priceCurrencyPair);
  }

  @Get()
  @Public()
  findAll() {
    return this.chargesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chargesService.findOne(+id);
  }

  @ApiBearerAuth('jwt-auth')
  @UserType(AccountType.ADMIN)
  @Roles(AllowedRoles.Operator, AllowedRoles.SuperAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChargeDto: UpdateChargeDto) {
    return this.chargesService.update(+id, updateChargeDto);
  }

  @ApiBearerAuth('jwt-auth')
  @UserType(AccountType.ADMIN)
  @Roles(AllowedRoles.Operator, AllowedRoles.SuperAdmin)
  @Patch('update-variant/:id')
  updateVariant(
    @Param('id') id: string,
    @Body() updateChargeVariantDto: UpdateChargeVariantDto,
  ) {
    return this.chargesService.updateVariant(+id, updateChargeVariantDto);
  }

  @ApiBearerAuth('jwt-auth')
  @UserType(AccountType.ADMIN)
  @Roles(AllowedRoles.Operator, AllowedRoles.SuperAdmin)
  @Patch('update-price-currency/:id')
  updatePriceCurrency(
    @Param('id') id: string,
    @Body() updatePriceCurrency: UpdatePriceCurrencyPairDto,
  ) {
    return this.chargesService.updatePriceCurrencyPair(
      +id,
      updatePriceCurrency,
    );
  }
}

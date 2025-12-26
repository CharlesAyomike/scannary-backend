import { PartialType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { PriceCurrencyPairDto } from './price-currency.dto';

export class UpdatePriceCurrencyPairDto extends PartialType(
  OmitType(PriceCurrencyPairDto, ['variantId'] as const),
) {}

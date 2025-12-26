import { PartialType } from '@nestjs/mapped-types';
import { ChargesVariantDto } from './charge-variant.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateChargeVariantDto extends PartialType(
  OmitType(ChargesVariantDto, ['subscriptionChargesId'] as const),
) {}
